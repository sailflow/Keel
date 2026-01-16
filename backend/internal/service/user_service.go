package service

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/keel/api/internal/model"
	"github.com/keel/api/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) List(ctx context.Context, page, limit int) (*model.PaginatedResponse[model.User], error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	users, total, err := s.repo.List(ctx, page, limit)
	if err != nil {
		return nil, err
	}

	totalPages := (total + limit - 1) / limit

	return &model.PaginatedResponse[model.User]{
		Data: users,
		Pagination: model.Pagination{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *UserService) GetByID(ctx context.Context, id string) (*model.User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *UserService) Create(ctx context.Context, req model.CreateUserRequest) (*model.User, error) {
	if req.Email == "" {
		return nil, errors.New("email is required")
	}
	if req.Name == "" {
		return nil, errors.New("name is required")
	}

	role := req.Role
	if role == "" {
		role = "user"
	}

	user := &model.User{
		ID:        uuid.New().String(),
		Email:     req.Email,
		Name:      req.Name,
		Role:      role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) Update(ctx context.Context, id string, req model.UpdateUserRequest) (*model.User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Role != "" {
		user.Role = req.Role
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
