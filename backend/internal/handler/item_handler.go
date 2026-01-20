package handler

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/keel/api/internal/apierror"
	"github.com/keel/api/internal/service"
)

// ItemHandler handles HTTP requests for item operations.
type ItemHandler struct {
	itemService *service.ItemService
}

// NewItemHandler creates a new ItemHandler.
func NewItemHandler(itemService *service.ItemService) *ItemHandler {
	return &ItemHandler{itemService: itemService}
}

// RegisterRoutes registers item routes on the given router.
func (h *ItemHandler) RegisterRoutes(r chi.Router) {
	r.Get("/items", h.List)
	r.Post("/items", h.Create)
	r.Get("/items/{id}", h.Get)
	r.Put("/items/{id}", h.Update)
	r.Delete("/items/{id}", h.Delete)
}

// CreateItemRequest represents the request body for creating an item.
type CreateItemRequest struct {
	UserID      string `json:"userId"`
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status,omitempty"`
}

// UpdateItemRequest represents the request body for updating an item.
type UpdateItemRequest struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Status      *string `json:"status,omitempty"`
}

// ItemResponse represents an item in the API response.
type ItemResponse struct {
	ID          string `json:"id"`
	UserID      string `json:"userId"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

// ItemListResponse represents a paginated list of items.
type ItemListResponse struct {
	Data       []ItemResponse     `json:"data"`
	Pagination PaginationResponse `json:"pagination"`
}

// List handles GET /api/items
func (h *ItemHandler) List(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit < 1 {
		limit = 10
	}

	userID := r.URL.Query().Get("userId")

	result, err := h.itemService.List(r.Context(), userID, page, limit)
	if err != nil {
		slog.Error("failed to list items", "error", err)
		apierror.InternalError(w, r, "Failed to list items")
		return
	}

	response := ItemListResponse{
		Data: make([]ItemResponse, len(result.Data)),
		Pagination: PaginationResponse{
			Page:       result.Page,
			Limit:      result.Limit,
			Total:      result.Total,
			TotalPages: result.TotalPages,
		},
	}

	for i, item := range result.Data {
		response.Data[i] = toItemResponse(&item)
	}

	writeJSON(w, http.StatusOK, response)
}

// Create handles POST /api/items
func (h *ItemHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apierror.BadRequest(w, r, "Invalid request body", nil)
		return
	}

	if req.UserID == "" {
		apierror.ValidationError(w, r, "User ID is required", nil)
		return
	}
	if req.Title == "" {
		apierror.ValidationError(w, r, "Title is required", nil)
		return
	}

	item, err := h.itemService.Create(r.Context(), service.CreateItemInput{
		UserID:      req.UserID,
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
	})
	if err != nil {
		slog.Error("failed to create item", "error", err)
		apierror.InternalError(w, r, "Failed to create item")
		return
	}

	writeJSON(w, http.StatusCreated, toItemResponse(item))
}

// Get handles GET /api/items/{id}
func (h *ItemHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		apierror.BadRequest(w, r, "Item ID is required", nil)
		return
	}

	item, err := h.itemService.Get(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrItemNotFound) {
			apierror.NotFound(w, r, "Item not found")
			return
		}
		slog.Error("failed to get item", "error", err, "id", id)
		apierror.InternalError(w, r, "Failed to get item")
		return
	}

	writeJSON(w, http.StatusOK, toItemResponse(item))
}

// Update handles PUT /api/items/{id}
func (h *ItemHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		apierror.BadRequest(w, r, "Item ID is required", nil)
		return
	}

	var req UpdateItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apierror.BadRequest(w, r, "Invalid request body", nil)
		return
	}

	item, err := h.itemService.Update(r.Context(), id, service.UpdateItemInput{
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
	})
	if err != nil {
		if errors.Is(err, service.ErrItemNotFound) {
			apierror.NotFound(w, r, "Item not found")
			return
		}
		slog.Error("failed to update item", "error", err, "id", id)
		apierror.InternalError(w, r, "Failed to update item")
		return
	}

	writeJSON(w, http.StatusOK, toItemResponse(item))
}

// Delete handles DELETE /api/items/{id}
func (h *ItemHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		apierror.BadRequest(w, r, "Item ID is required", nil)
		return
	}

	err := h.itemService.Delete(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrItemNotFound) {
			apierror.NotFound(w, r, "Item not found")
			return
		}
		slog.Error("failed to delete item", "error", err, "id", id)
		apierror.InternalError(w, r, "Failed to delete item")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// toItemResponse converts a service item to an API response.
func toItemResponse(item *service.Item) ItemResponse {
	return ItemResponse{
		ID:          item.ID,
		UserID:      item.UserID,
		Title:       item.Title,
		Description: item.Description,
		Status:      item.Status,
		CreatedAt:   item.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:   item.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
