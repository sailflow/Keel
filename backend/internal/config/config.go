package config

import (
	"log/slog"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	AppName     string
	CorsOrigins []string
}

func Load() *Config {
	// Attempt to load .env file, but don't fail if it doesn't exist (e.g. production)
	if err := godotenv.Load(); err != nil {
		slog.Debug("No .env file found or error loading it")
	}

	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "file:./data/keel.db?_foreign_keys=on"),
		AppName:     getEnv("APP_NAME", "Keel"),
		CorsOrigins: strings.Split(getEnv("CORS_ORIGINS", "http://localhost:3000"), ","),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
