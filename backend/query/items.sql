-- name: CreateItem :one
INSERT INTO items (id, user_id, title, description, status, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;

-- name: GetItem :one
SELECT * FROM items WHERE id = ? LIMIT 1;

-- name: ListItems :many
SELECT * FROM items ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: ListItemsByUser :many
SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: CountItems :one
SELECT COUNT(*) FROM items;

-- name: CountItemsByUser :one
SELECT COUNT(*) FROM items WHERE user_id = ?;

-- name: UpdateItem :one
UPDATE items 
SET title = COALESCE(?, title),
    description = COALESCE(?, description),
    status = COALESCE(?, status),
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteItem :exec
DELETE FROM items WHERE id = ?;
