#!/usr/bin/env bun
/**
 * Clean Examples Script
 * 
 * Removes all example boilerplate code (Users, Items) so you can start fresh.
 * Run with: bun run clean-examples
 */

import { existsSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { $ } from 'bun';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

console.log('🧹 Cleaning example code...\n');

// Files to delete
const filesToDelete = [
  // Backend services
  'backend/internal/service/user_service.go',
  'backend/internal/service/item_service.go',
  // Backend handlers
  'backend/internal/handler/user_handler.go',
  'backend/internal/handler/item_handler.go',
  // Migrations
  'backend/migrations/001_init.sql',
  'backend/migrations/002_items.sql',
  // SQL queries
  'backend/query/users.sql',
  'backend/query/items.sql',
];

// Directories to delete
const dirsToDelete = [
  'frontend/src/app/users',
];

// Delete files
for (const file of filesToDelete) {
  const fullPath = join(ROOT, file);
  if (existsSync(fullPath)) {
    rmSync(fullPath);
    console.log(`  ✓ Deleted ${file}`);
  }
}

// Delete directories
for (const dir of dirsToDelete) {
  const fullPath = join(ROOT, dir);
  if (existsSync(fullPath)) {
    rmSync(fullPath, { recursive: true });
    console.log(`  ✓ Deleted ${dir}/`);
  }
}

// Create empty placeholder files
console.log('\n📝 Creating placeholder files...\n');

// Empty migration
const migrationContent = `-- Your schema goes here
-- Example:
-- CREATE TABLE IF NOT EXISTS your_table (
--     id TEXT PRIMARY KEY,
--     name TEXT NOT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );
`;
writeFileSync(join(ROOT, 'backend/migrations/001_init.sql'), migrationContent);
console.log('  ✓ Created backend/migrations/001_init.sql (placeholder)');

// Empty query file
const queryContent = `-- Your sqlc queries go here
-- Example:
-- -- name: GetItem :one
-- SELECT * FROM your_table WHERE id = ? LIMIT 1;
`;
writeFileSync(join(ROOT, 'backend/query/example.sql'), queryContent);
console.log('  ✓ Created backend/query/example.sql (placeholder)');

// Reset OpenAPI spec to minimal
const openapiContent = `openapi: 3.1.0
info:
  title: API
  version: 1.0.0
  description: Your API description

servers:
  - url: http://localhost:8080
    description: Local development

paths:
  /health:
    get:
      summary: Health check
      operationId: healthCheck
      tags:
        - System
      responses:
        "200":
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: ok

  # Add your endpoints here:
  # /api/your-resource:
  #   get:
  #     summary: List resources
  #     ...

components:
  parameters:
    PageParam:
      name: page
      in: query
      description: Page number (1-indexed)
      schema:
        type: integer
        minimum: 1
        default: 1

    LimitParam:
      name: limit
      in: query
      description: Number of items per page
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10

  schemas:
    Pagination:
      type: object
      required:
        - page
        - limit
        - total
        - totalPages
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

    APIError:
      type: object
      required:
        - code
        - message
        - requestId
      properties:
        code:
          type: string
          enum:
            - VALIDATION_ERROR
            - NOT_FOUND
            - CONFLICT
            - INTERNAL_ERROR
            - BAD_REQUEST
        message:
          type: string
        details:
          description: Additional error details
        requestId:
          type: string

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/APIError"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/APIError"

    Conflict:
      description: Resource conflict
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/APIError"

    InternalError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/APIError"
`;
writeFileSync(join(ROOT, 'backend/api/openapi.yaml'), openapiContent);
console.log('  ✓ Reset backend/api/openapi.yaml (minimal spec)');

// Update main.go to remove example handlers
const mainGoContent = `package main

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
	"github.com/keel/api/internal/middleware"
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
	} else {
		slog.Info("database url not set, skipping database connection")
	}

	// TODO: Initialize your services here
	// yourService := service.NewYourService(db, queries)

	// TODO: Initialize your handlers here
	// yourHandler := handler.NewYourHandler(yourService)

	// Router setup
	r := chi.NewRouter()

	// Global middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
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
		// TODO: Register your handlers here
		// yourHandler.RegisterRoutes(r)
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		resp := map[string]string{
			"status":   "ok",
			"app_name": cfg.AppName,
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			slog.Error("failed to write response", "error", err)
		}
	})

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
		slog.Info("server listening", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			return err
		}
		return nil
	})

	// Shutdown goroutine
	g.Go(func() error {
		<-gCtx.Done()
		slog.Info("shutting down server")
		shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelShutdown()
		return srv.Shutdown(shutdownCtx)
	})

	return g.Wait()
}

func runMigrations(db *sql.DB) error {
	return database.RunMigrations(db, migrations.FS)
}
`;
writeFileSync(join(ROOT, 'backend/cmd/server/main.go'), mainGoContent);
console.log('  ✓ Reset backend/cmd/server/main.go (clean template)');

// Reset home page to minimal
const homePageContent = `export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Your App
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start building something amazing.
        </p>
      </div>
    </div>
  );
}
`;
writeFileSync(join(ROOT, 'frontend/src/app/page.tsx'), homePageContent);
console.log('  ✓ Reset frontend/src/app/page.tsx (minimal home page)');

// Regenerate sqlc (will create empty store)
console.log('\n🔄 Regenerating code...\n');

try {
  await $`cd ${ROOT} /backend && sqlc generate 2>/dev / null || true`;
  console.log('  ✓ Regenerated sqlc store');
} catch {
  console.log('  ⚠ sqlc not found, skip store generation');
}

try {
  await $`cd ${ROOT} && bun run generate: api`;
  console.log('  ✓ Regenerated API client');
} catch {
  console.log('  ⚠ Could not regenerate API client');
}

console.log('\n✨ Done! The template is now clean.\n');
console.log('Next steps:');
console.log('  1. Define your schema in backend/api/openapi.yaml');
console.log('  2. Create migrations in backend/migrations/');
console.log('  3. Write SQL queries in backend/query/');
console.log('  4. Run: cd backend && sqlc generate');
console.log('  5. Create services and handlers');
console.log('  6. Run: bun run generate:api');
console.log('');
