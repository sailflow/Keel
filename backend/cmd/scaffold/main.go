package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"text/template"
	"unicode"
)

var (
	resourceName string
)

func main() {
	flag.StringVar(&resourceName, "name", "", "Name of the resource to scaffold (e.g., 'season')")
	flag.Parse()

	if resourceName == "" {
		fmt.Println("Error: Resource name is required")
		flag.Usage()
		os.Exit(1)
	}

	// Normalize name
	resourceName = strings.ToLower(resourceName)
	pascalName := toPascalCase(resourceName)

	fmt.Printf("Scaffolding resource: %s (Pascal: %s)\n", resourceName, pascalName)

	// Define files to generate
	files := []struct {
		Path    string
		Content string
	}{
		{
			Path: fmt.Sprintf("internal/model/%s.go", resourceName),
			Content: `package model

type {{.PascalName}} struct {
	ID   string ` + "`json:\"id\"`" + `
	Name string ` + "`json:\"name\"`" + `
}
`,
		},
		{
			Path: fmt.Sprintf("internal/store/%s_store.go", resourceName),
			Content: `package store

import (
	"context"
	"database/sql"
	"github.com/keel/api/internal/model"
)

type {{.PascalName}}Store struct {
	*BaseStore
}

func New{{.PascalName}}Store(db *sql.DB) *{{.PascalName}}Store {
	return &{{.PascalName}}Store{BaseStore: NewBaseStore(db)}
}

func (s *{{.PascalName}}Store) Create(ctx context.Context, item *model.{{.PascalName}}) error {
	// TODO: Implement Create
	return nil
}

func (s *{{.PascalName}}Store) Get(ctx context.Context, id string) (*model.{{.PascalName}}, error) {
	// TODO: Implement Get
	return nil, nil // sql.ErrNoRows
}

func (s *{{.PascalName}}Store) List(ctx context.Context) ([]*model.{{.PascalName}}, error) {
	// TODO: Implement List
	return []*model.{{.PascalName}}{}, nil
}
`,
		},
		{
			Path: fmt.Sprintf("internal/service/%s.go", resourceName),
			Content: `package service

import (
	"context"
	"github.com/keel/api/internal/model"
	"github.com/keel/api/internal/store"
)

type {{.PascalName}}Service struct {
	store *store.{{.PascalName}}Store
}

func New{{.PascalName}}Service(store *store.{{.PascalName}}Store) *{{.PascalName}}Service {
	return &{{.PascalName}}Service{store: store}
}

func (s *{{.PascalName}}Service) Create(ctx context.Context, item *model.{{.PascalName}}) error {
	return s.store.Create(ctx, item)
}

func (s *{{.PascalName}}Service) Get(ctx context.Context, id string) (*model.{{.PascalName}}, error) {
	return s.store.Get(ctx, id)
}

func (s *{{.PascalName}}Service) List(ctx context.Context) ([]*model.{{.PascalName}}, error) {
	return s.store.List(ctx)
}
`,
		},
		{
			Path: fmt.Sprintf("internal/handler/%s.go", resourceName),
			Content: `package handler

import (
	"encoding/json"
	"net/http"
	"github.com/go-chi/chi/v5"
	"github.com/keel/api/internal/service"
)

type {{.PascalName}}Handler struct {
	service *service.{{.PascalName}}Service
}

func New{{.PascalName}}Handler(service *service.{{.PascalName}}Service) *{{.PascalName}}Handler {
	return &{{.PascalName}}Handler{service: service}
}

func (h *{{.PascalName}}Handler) RegisterRoutes(r chi.Router) {
	r.Route("/{{.LowerName}}s", func(r chi.Router) {
		r.Get("/", h.List)
		r.Get("/{id}", h.Get)
		// r.Post("/", h.Create)
	})
}

func (h *{{.PascalName}}Handler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.service.List(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(items)
}

func (h *{{.PascalName}}Handler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	item, err := h.service.Get(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(item)
}
`,
		},
	}

	data := struct {
		PascalName string
		LowerName  string
	}{
		PascalName: pascalName,
		LowerName:  resourceName,
	}

	for _, f := range files {
		tmpl, err := template.New("file").Parse(f.Content)
		if err != nil {
			fmt.Printf("Error parsing template for %s: %v\n", f.Path, err)
			continue
		}

		// Ensure directory exists
		dir := filepath.Dir(f.Path)
		if err := os.MkdirAll(dir, 0755); err != nil {
			fmt.Printf("Error creating directory %s: %v\n", dir, err)
			continue
		}

		// check if file exists
		if _, err := os.Stat(f.Path); err == nil {
			fmt.Printf("File already exists, skipping: %s\n", f.Path)
			continue
		}

		file, err := os.Create(f.Path)
		if err != nil {
			fmt.Printf("Error creating file %s: %v\n", f.Path, err)
			continue
		}
		defer func() {
			if err := file.Close(); err != nil {
				fmt.Printf("Error closing file %s: %v\n", f.Path, err)
			}
		}()

		if err := tmpl.Execute(file, data); err != nil {
			fmt.Printf("Error executing template for %s: %v\n", f.Path, err)
			continue
		}

		fmt.Printf("Created: %s\n", f.Path)
	}

	fmt.Println("\nDone! Don't forget to wire up the new handler in cmd/server/main.go")
}

func toPascalCase(s string) string {
	runes := []rune(s)
	if len(runes) > 0 {
		runes[0] = unicode.ToUpper(runes[0])
	}
	return string(runes)
}
