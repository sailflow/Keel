package service

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/keel/api/internal/store"
)

// User represents a user in the system.
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// CreateUserInput represents the input for creating a user.
type CreateUserInput struct {
	Email string
	Name  string
	Role  string
}

// UpdateUserInput represents the input for updating a user.
type UpdateUserInput struct {
	Email *string
	Name  *string
	Role  *string
}

// UserListResult represents a paginated list of users.
type UserListResult struct {
	Data       []User
	Page       int
	Limit      int
	Total      int64
	TotalPages int
}

// Common errors
var (
	ErrUserNotFound      = errors.New("user not found")
	ErrUserAlreadyExists = errors.New("user with this email already exists")
)

// UserService provides user-related business logic.
type UserService struct {
	queries *store.Queries
	db      *sql.DB
}

// NewUserService creates a new UserService.
func NewUserService(db *sql.DB, queries *store.Queries) *UserService {
	return &UserService{
		queries: queries,
		db:      db,
	}
}

// Create creates a new user.
func (s *UserService) Create(ctx context.Context, input CreateUserInput) (*User, error) {
	// Check if user with email already exists
	_, err := s.queries.GetUserByEmail(ctx, input.Email)
	if err == nil {
		return nil, ErrUserAlreadyExists
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	// Set default role
	role := input.Role
	if role == "" {
		role = "user"
	}

	id := uuid.New().String()

	dbUser, err := s.queries.CreateUser(ctx, store.CreateUserParams{
		ID:    id,
		Email: input.Email,
		Name:  input.Name,
		Role:  role,
	})
	if err != nil {
		return nil, err
	}

	return toUser(dbUser), nil
}

// Get retrieves a user by ID.
func (s *UserService) Get(ctx context.Context, id string) (*User, error) {
	dbUser, err := s.queries.GetUser(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return toUser(dbUser), nil
}

// List retrieves a paginated list of users.
func (s *UserService) List(ctx context.Context, page, limit int) (*UserListResult, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	offset := (page - 1) * limit

	users, err := s.queries.ListUsers(ctx, store.ListUsersParams{
		Limit:  int64(limit),
		Offset: int64(offset),
	})
	if err != nil {
		return nil, err
	}

	total, err := s.queries.CountUsers(ctx)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	result := &UserListResult{
		Data:       make([]User, len(users)),
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	for i, u := range users {
		result.Data[i] = *toUser(u)
	}

	return result, nil
}

// Update updates a user.
func (s *UserService) Update(ctx context.Context, id string, input UpdateUserInput) (*User, error) {
	// Check if user exists
	existing, err := s.queries.GetUser(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	// Check for email conflict if updating email
	if input.Email != nil && *input.Email != existing.Email {
		existingByEmail, err := s.queries.GetUserByEmail(ctx, *input.Email)
		if err == nil && existingByEmail.ID != id {
			return nil, ErrUserAlreadyExists
		}
	}

	// Use existing values if not provided
	params := store.UpdateUserParams{
		ID:    id,
		Email: existing.Email,
		Name:  existing.Name,
		Role:  existing.Role,
	}

	if input.Email != nil {
		params.Email = *input.Email
	}
	if input.Name != nil {
		params.Name = *input.Name
	}
	if input.Role != nil {
		params.Role = *input.Role
	}

	dbUser, err := s.queries.UpdateUser(ctx, params)
	if err != nil {
		return nil, err
	}

	return toUser(dbUser), nil
}

// Delete removes a user.
func (s *UserService) Delete(ctx context.Context, id string) error {
	// Check if user exists first
	_, err := s.queries.GetUser(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrUserNotFound
		}
		return err
	}

	return s.queries.DeleteUser(ctx, id)
}

// toUser converts a database user to a service user.
func toUser(dbUser store.User) *User {
	return &User{
		ID:        dbUser.ID,
		Email:     dbUser.Email,
		Name:      dbUser.Name,
		Role:      dbUser.Role,
		CreatedAt: dbUser.CreatedAt.Time,
		UpdatedAt: dbUser.UpdatedAt.Time,
	}
}
