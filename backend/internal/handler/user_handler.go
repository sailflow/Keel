package handler

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"github.com/keel/api/internal/middleware"
	"github.com/keel/api/internal/model"
	"github.com/keel/api/internal/repository"
	"github.com/keel/api/internal/service"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	result, err := h.service.List(r.Context(), page, limit)
	if err != nil {
		writeError(w, r, http.StatusInternalServerError, model.ErrCodeInternal, "Failed to fetch users", err)
		return
	}

	writeJSON(w, http.StatusOK, result)
}

func (h *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	user, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			writeError(w, r, http.StatusNotFound, model.ErrCodeNotFound, "User not found", nil)
			return
		}
		writeError(w, r, http.StatusInternalServerError, model.ErrCodeInternal, "Failed to fetch user", err)
		return
	}

	writeJSON(w, http.StatusOK, user)
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, r, http.StatusBadRequest, model.ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	user, err := h.service.Create(r.Context(), req)
	if err != nil {
		if errors.Is(err, repository.ErrConflict) {
			writeError(w, r, http.StatusConflict, model.ErrCodeConflict, "User with this email already exists", nil)
			return
		}
		if err.Error() == "email is required" || err.Error() == "name is required" {
			writeError(w, r, http.StatusBadRequest, model.ErrCodeValidation, err.Error(), nil)
			return
		}
		writeError(w, r, http.StatusInternalServerError, model.ErrCodeInternal, "Failed to create user", err)
		return
	}

	writeJSON(w, http.StatusCreated, user)
}

func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req model.UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, r, http.StatusBadRequest, model.ErrCodeBadRequest, "Invalid request body", nil)
		return
	}

	user, err := h.service.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			writeError(w, r, http.StatusNotFound, model.ErrCodeNotFound, "User not found", nil)
			return
		}
		writeError(w, r, http.StatusInternalServerError, model.ErrCodeInternal, "Failed to update user", err)
		return
	}

	writeJSON(w, http.StatusOK, user)
}

func (h *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	err := h.service.Delete(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			writeError(w, r, http.StatusNotFound, model.ErrCodeNotFound, "User not found", nil)
			return
		}
		writeError(w, r, http.StatusInternalServerError, model.ErrCodeInternal, "Failed to delete user", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		slog.Error("failed to encode response", "error", err)
	}
}

func writeError(w http.ResponseWriter, r *http.Request, status int, code, message string, details interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(model.APIError{
		Code:      code,
		Message:   message,
		Details:   details,
		RequestID: middleware.GetRequestID(r.Context()),
	}); err != nil {
		slog.Error("failed to encode error response", "error", err)
	}
}
