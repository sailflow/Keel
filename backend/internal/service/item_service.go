package service

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/keel/api/internal/store"
)

// Item represents an item in the system.
type Item struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// CreateItemInput represents the input for creating an item.
type CreateItemInput struct {
	UserID      string
	Title       string
	Description string
	Status      string
}

// UpdateItemInput represents the input for updating an item.
type UpdateItemInput struct {
	Title       *string
	Description *string
	Status      *string
}

// ItemListResult represents a paginated list of items.
type ItemListResult struct {
	Data       []Item
	Page       int
	Limit      int
	Total      int64
	TotalPages int
}

// Common errors
var (
	ErrItemNotFound = errors.New("item not found")
)

// ItemService provides item-related business logic.
type ItemService struct {
	queries *store.Queries
	db      *sql.DB
}

// NewItemService creates a new ItemService.
func NewItemService(db *sql.DB, queries *store.Queries) *ItemService {
	return &ItemService{
		queries: queries,
		db:      db,
	}
}

// Create creates a new item.
func (s *ItemService) Create(ctx context.Context, input CreateItemInput) (*Item, error) {
	status := input.Status
	if status == "" {
		status = "pending"
	}

	id := uuid.New().String()

	dbItem, err := s.queries.CreateItem(ctx, store.CreateItemParams{
		ID:          id,
		UserID:      input.UserID,
		Title:       input.Title,
		Description: sql.NullString{String: input.Description, Valid: input.Description != ""},
		Status:      status,
	})
	if err != nil {
		return nil, err
	}

	return toItem(dbItem), nil
}

// Get retrieves an item by ID.
func (s *ItemService) Get(ctx context.Context, id string) (*Item, error) {
	dbItem, err := s.queries.GetItem(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrItemNotFound
		}
		return nil, err
	}

	return toItem(dbItem), nil
}

// List retrieves a paginated list of items, optionally filtered by user.
func (s *ItemService) List(ctx context.Context, userID string, page, limit int) (*ItemListResult, error) {
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

	var items []store.Item
	var total int64
	var err error

	if userID != "" {
		items, err = s.queries.ListItemsByUser(ctx, store.ListItemsByUserParams{
			UserID: userID,
			Limit:  int64(limit),
			Offset: int64(offset),
		})
		if err != nil {
			return nil, err
		}
		total, err = s.queries.CountItemsByUser(ctx, userID)
	} else {
		items, err = s.queries.ListItems(ctx, store.ListItemsParams{
			Limit:  int64(limit),
			Offset: int64(offset),
		})
		if err != nil {
			return nil, err
		}
		total, err = s.queries.CountItems(ctx)
	}
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	result := &ItemListResult{
		Data:       make([]Item, len(items)),
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	for i, item := range items {
		result.Data[i] = *toItem(item)
	}

	return result, nil
}

// Update updates an item.
func (s *ItemService) Update(ctx context.Context, id string, input UpdateItemInput) (*Item, error) {
	existing, err := s.queries.GetItem(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrItemNotFound
		}
		return nil, err
	}

	params := store.UpdateItemParams{
		ID:          id,
		Title:       existing.Title,
		Description: existing.Description,
		Status:      existing.Status,
	}

	if input.Title != nil {
		params.Title = *input.Title
	}
	if input.Description != nil {
		params.Description = sql.NullString{String: *input.Description, Valid: *input.Description != ""}
	}
	if input.Status != nil {
		params.Status = *input.Status
	}

	dbItem, err := s.queries.UpdateItem(ctx, params)
	if err != nil {
		return nil, err
	}

	return toItem(dbItem), nil
}

// Delete removes an item.
func (s *ItemService) Delete(ctx context.Context, id string) error {
	_, err := s.queries.GetItem(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrItemNotFound
		}
		return err
	}

	return s.queries.DeleteItem(ctx, id)
}

// toItem converts a database item to a service item.
func toItem(dbItem store.Item) *Item {
	desc := ""
	if dbItem.Description.Valid {
		desc = dbItem.Description.String
	}

	return &Item{
		ID:          dbItem.ID,
		UserID:      dbItem.UserID,
		Title:       dbItem.Title,
		Description: desc,
		Status:      dbItem.Status,
		CreatedAt:   dbItem.CreatedAt.Time,
		UpdatedAt:   dbItem.UpdatedAt.Time,
	}
}
