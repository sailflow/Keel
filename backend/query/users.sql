-- name: CreateUser :one
INSERT INTO users (email) VALUES (?) RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE id = ? LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users ORDER BY id;

-- name: UpdateUser :one
UPDATE users SET email = ? WHERE id = ? RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = ?;
