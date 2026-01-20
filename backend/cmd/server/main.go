package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/keel/api/internal/config"
	"github.com/keel/api/internal/database"
	"github.com/keel/api/internal/handler"
	"github.com/keel/api/internal/middleware"
	"github.com/keel/api/internal/service"
	"github.com/keel/api/internal/store"
	"github.com/keel/api/migrations"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/sync/errgroup"
)

func main() {
	// Setup structured logging
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	if os.Getenv("GO_ENV") == "production" {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
	}
	slog.SetDefault(logger)

	if err := run(context.Background()); err != nil {
		slog.Error("application exited with error", "error", err)
		os.Exit(1)
	}
}

func run(ctx context.Context) error {
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer cancel()

	// Load configuration
	cfg := config.Load()
	slog.Info("starting application", "app_name", cfg.AppName)

	// Database connection (Optional)
	var db *sql.DB
	var queries *store.Queries
	if cfg.DatabaseURL != "" {
		slog.Info("connecting to database", "url", cfg.DatabaseURL)
		var err error
		db, err = sql.Open("sqlite3", cfg.DatabaseURL)
		if err != nil {
			return errors.New("failed to connect to database: " + err.Error())
		}
		defer func() {
			if err := db.Close(); err != nil {
				slog.Error("error closing database", "error", err)
			}
		}()

		// Run migrations
		if err := runMigrations(db); err != nil {
			return errors.New("failed to run migrations: " + err.Error())
		}

		// Initialize store
		queries = store.New(db)
	} else {
		slog.Info("database url not set, skipping database connection")
	}

	// Initialize services
	userService := service.NewUserService(db, queries)
	itemService := service.NewItemService(db, queries)

	// Initialize handlers
	userHandler := handler.NewUserHandler(userService)
	itemHandler := handler.NewItemHandler(itemService)

	// Router setup
	r := chi.NewRouter()

	// Global middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger) // Chi's default logger is okay, but we could wrap slog
	r.Use(chimiddleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CorsOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Request-ID"},
		ExposedHeaders:   []string{"X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Routes
	r.Route("/api", func(r chi.Router) {
		userHandler.RegisterRoutes(r)
		itemHandler.RegisterRoutes(r)
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		resp := map[string]string{
			"status":   "ok",
			"app_name": cfg.AppName,
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			slog.Error("failed to write health response", "error", err)
		}
	})

	// Server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	g, gCtx := errgroup.WithContext(ctx)

	// Server goroutine
	g.Go(func() error {
		slog.Info("server starting", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			return err
		}
		return nil
	})

	// Shutdown goroutine
	g.Go(func() error {
		<-gCtx.Done()
		slog.Info("server shutting down")

		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer shutdownCancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			return errors.New("server forced to shutdown: " + err.Error())
		}
		return nil
	})

	slog.Info("application ready")
	return g.Wait()
}

func runMigrations(db *sql.DB) error {
	return database.RunMigrations(db, migrations.FS, ".")
}
