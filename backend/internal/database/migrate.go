package database

import (
	"database/sql"
	"embed"
	"fmt"
	"log/slog"
	"sort"
	"strings"
)

// RunMigrations executes SQL migration files from the given embed.FS
func RunMigrations(db *sql.DB, fs embed.FS, dir string) error {
	slog.Info("Running migrations...")

	// ensure schema_migrations table exists
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
		version INTEGER PRIMARY KEY,
		applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`)
	if err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}

	entries, err := fs.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	// Filter and sort entries
	var files []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".sql") {
			files = append(files, entry.Name())
		}
	}
	sort.Strings(files)

	for _, file := range files {
		if err := applyMigration(db, fs, dir+"/"+file); err != nil {
			return fmt.Errorf("failed to apply migration %s: %w", file, err)
		}
	}

	slog.Info("Migrations completed successfully")
	return nil
}

func applyMigration(db *sql.DB, fs embed.FS, path string) error {
	// Simple version extraction (assuming format 001_name.sql)
	// mostly for display or robust tracking, but here we just check if it's run.
	// A real implementation would parse the version number.
	// For this template, we'll just skip if the filename exists in the table?
	// Actually, let's just run them if they haven't been run.
	// This simple runner assumes files are append-only and immutable.

	filename := path[strings.LastIndex(path, "/")+1:]

	// Check if migration already applied
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = ?)", filename).Scan(&exists)
	if err == nil && exists {
		// Already applied
		return nil
	}
	// Note: The schema_migrations table created in 001_init.sql uses INTEGER version.
	// But my code here uses filename as version?
	// Wait, the 001_init.sql creates schema_migrations with INTEGER.
	// Let's adjust the schema_migrations table creation in this file to use TEXT for flexibility
	// OR parse the integer.
	// Parsing integer is safer for ordering.

	var version int
	_, err = fmt.Sscanf(filename, "%d_", &version)
	if err != nil {
		return fmt.Errorf("invalid migration filename format %s, expected NNN_name.sql: %w", filename, err)
	}

	// Check by integer version
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = ?)", version).Scan(&exists)
	if err != nil {
		return fmt.Errorf("failed to check migration status: %w", err)
	}
	if exists {
		return nil
	}

	slog.Info("Applying migration", "file", filename)

	content, err := fs.ReadFile(path)
	if err != nil {
		return err
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	if _, err := tx.Exec(string(content)); err != nil {
		return err
	}

	if _, err := tx.Exec("INSERT INTO schema_migrations (version) VALUES (?)", version); err != nil {
		return err
	}

	return tx.Commit()
}
