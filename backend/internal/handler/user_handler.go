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

// UserHandler handles HTTP requests for user operations.
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler creates a new UserHandler.
func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// RegisterRoutes registers user routes on the given router.
func (h *UserHandler) RegisterRoutes(r chi.Router) {
	r.Get("/users", h.List)
	r.Post("/users", h.Create)
	r.Get("/users/{id}", h.Get)
	r.Put("/users/{id}", h.Update)
	r.Delete("/users/{id}", h.Delete)
}

// CreateUserRequest represents the request body for creating a user.
type CreateUserRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role,omitempty"`
}

// UpdateUserRequest represents the request body for updating a user.
type UpdateUserRequest struct {
	Email *string `json:"email,omitempty"`
	Name  *string `json:"name,omitempty"`
	Role  *string `json:"role,omitempty"`
}

// UserResponse represents a user in the API response.
type UserResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

// UserListResponse represents a paginated list of users.
type UserListResponse struct {
	Data       []UserResponse     `json:"data"`
	Pagination PaginationResponse `json:"pagination"`
}

// PaginationResponse represents pagination metadata.
type PaginationResponse struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"totalPages"`
}

// List handles GET /api/users
func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit < 1 {
		limit = 10
	}

	result, err := h.userService.List(r.Context(), page, limit)
	if err != nil {
		slog.Error("failed to list users", "error", err)
		apierror.InternalError(w, r, "Failed to list users")
		return
	}

	response := UserListResponse{
		Data: make([]UserResponse, len(result.Data)),
		Pagination: PaginationResponse{
			Page:       result.Page,
			Limit:      result.Limit,
			Total:      result.Total,
			TotalPages: result.TotalPages,
		},
	}

	for i, u := range result.Data {
		response.Data[i] = toUserResponse(&u)
	}

	writeJSON(w, http.StatusOK, response)
}

// Create handles POST /api/users
func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apierror.BadRequest(w, r, "Invalid request body", nil)
		return
	}

	// Basic validation
	if req.Email == "" {
		apierror.ValidationError(w, r, "Email is required", nil)
		return
	}
	if req.Name == "" {
		apierror.ValidationError(w, r, "Name is required", nil)
		return
	}

	user, err := h.userService.Create(r.Context(), service.CreateUserInput{
		Email: req.Email,
		Name:  req.Name,
		Role:  req.Role,
	})
	if err != nil {
		if errors.Is(err, service.ErrUserAlreadyExists) {
			apierror.Conflict(w, r, "User with this email already exists")
			return
		}
		slog.Error("failed to create user", "error", err)
		apierror.InternalError(w, r, "Failed to create user")
		return
	}

	writeJSON(w, http.StatusCreated, toUserResponse(user))
}

// Get handles GET /api/users/{id}
func (h *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		apierror.BadRequest(w, r, "User ID is required", nil)
		return
	}

	user, err := h.userService.Get(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			apierror.NotFound(w, r, "User not found")
			return
		}
		slog.Error("failed to get user", "error", err, "id", id)
		apierror.InternalError(w, r, "Failed to get user")
		return
	}

	writeJSON(w, http.StatusOK, toUserResponse(user))
}

// Update handles PUT /api/users/{id}
func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		apierror.BadRequest(w, r, "User ID is required", nil)
		return
	}

	var req UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apierror.BadRequest(w, r, "Invalid request body", nil)
		return
	}

	user, err := h.userService.Update(r.Context(), id, service.UpdateUserInput{
		Email: req.Email,
		Name:  req.Name,
		Role:  req.Role,
	})
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			apierror.NotFound(w, r, "User not found")
			return
		}
		if errors.Is(err, service.ErrUserAlreadyExists) {
			apierror.Conflict(w, r, "Email already in use")
			return
		}
		slog.Error("failed to update user", "error", err, "id", id)
		apierror.InternalError(w, r, "Failed to update user")
		return
	}

	writeJSON(w, http.StatusOK, toUserResponse(user))
}

// Delete handles DELETE /api/users/{id}
func (h *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		apierror.BadRequest(w, r, "User ID is required", nil)
		return
	}

	err := h.userService.Delete(r.Context(), id)
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			apierror.NotFound(w, r, "User not found")
			return
		}
		slog.Error("failed to delete user", "error", err, "id", id)
		apierror.InternalError(w, r, "Failed to delete user")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// toUserResponse converts a service user to an API response.
func toUserResponse(u *service.User) UserResponse {
	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Name:      u.Name,
		Role:      u.Role,
		CreatedAt: u.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: u.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// writeJSON writes a JSON response.
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		slog.Error("failed to write JSON response", "error", err)
	}
}
