package apierror

import (
	"encoding/json"
	"net/http"

	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

// ErrorCode represents API error codes following RFC 7807.
type ErrorCode string

const (
	CodeValidationError ErrorCode = "VALIDATION_ERROR"
	CodeBadRequest      ErrorCode = "BAD_REQUEST"
	CodeNotFound        ErrorCode = "NOT_FOUND"
	CodeConflict        ErrorCode = "CONFLICT"
	CodeUnauthorized    ErrorCode = "UNAUTHORIZED"
	CodeInternalError   ErrorCode = "INTERNAL_ERROR"
)

// APIError represents a structured error response (RFC 7807 Problem Details).
type APIError struct {
	Code      ErrorCode   `json:"code"`
	Message   string      `json:"message"`
	Details   interface{} `json:"details,omitempty"`
	RequestID string      `json:"requestId"`
}

// Write sends an error response to the client.
func Write(w http.ResponseWriter, r *http.Request, status int, code ErrorCode, message string, details interface{}) {
	requestID := chimiddleware.GetReqID(r.Context())

	apiErr := APIError{
		Code:      code,
		Message:   message,
		Details:   details,
		RequestID: requestID,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(apiErr)
}

// NotFound writes a 404 error response.
func NotFound(w http.ResponseWriter, r *http.Request, message string) {
	if message == "" {
		message = "Resource not found"
	}
	Write(w, r, http.StatusNotFound, CodeNotFound, message, nil)
}

// BadRequest writes a 400 error response.
func BadRequest(w http.ResponseWriter, r *http.Request, message string, details interface{}) {
	if message == "" {
		message = "Bad request"
	}
	Write(w, r, http.StatusBadRequest, CodeBadRequest, message, details)
}

// ValidationError writes a 400 error response for validation failures.
func ValidationError(w http.ResponseWriter, r *http.Request, message string, details interface{}) {
	if message == "" {
		message = "Validation error"
	}
	Write(w, r, http.StatusBadRequest, CodeValidationError, message, details)
}

// Conflict writes a 409 error response.
func Conflict(w http.ResponseWriter, r *http.Request, message string) {
	if message == "" {
		message = "Resource already exists"
	}
	Write(w, r, http.StatusConflict, CodeConflict, message, nil)
}

// Unauthorized writes a 401 error response.
func Unauthorized(w http.ResponseWriter, r *http.Request, message string) {
	if message == "" {
		message = "Unauthorized"
	}
	Write(w, r, http.StatusUnauthorized, CodeUnauthorized, message, nil)
}

// InternalError writes a 500 error response.
func InternalError(w http.ResponseWriter, r *http.Request, message string) {
	if message == "" {
		message = "Internal server error"
	}
	Write(w, r, http.StatusInternalServerError, CodeInternalError, message, nil)
}
