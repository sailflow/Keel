package store

import (
	"context"
	"database/sql"
	"errors"
)

// BaseStore provides common functionality for all stores
type BaseStore struct {
	db *sql.DB
}

// NewBaseStore creates a new BaseStore
func NewBaseStore(db *sql.DB) *BaseStore {
	return &BaseStore{db: db}
}

// ExecTx executes a function within a transaction
func (s *BaseStore) ExecTx(ctx context.Context, fn func(tx *sql.Tx) error) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return errors.New(err.Error() + "; rollback error: " + rbErr.Error())
		}
		return err
	}

	return tx.Commit()
}
