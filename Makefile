.PHONY: help install dev build up down logs clean test test-backend test-frontend seed init-db

help:
	@echo "E-Commerce Platform - Makefile Commands"
	@echo "========================================"
	@echo "make install       - Install dependencies"
	@echo "make dev           - Start development environment"
	@echo "make build         - Build all Docker images"
	@echo "make up            - Start production environment"
	@echo "make down          - Stop all containers"
	@echo "make logs          - View logs"
	@echo "make clean         - Remove volumes and containers"
	@echo "make init-db       - Initialize database tables"
	@echo "make seed          - Seed database with sample data"
	@echo "make test          - Run all tests"
	@echo "make test-backend  - Run backend tests"
	@echo "make test-frontend- Run frontend tests"

install:
	cd backend && pip install -r requirements.txt
	cd backend && pip install -r requirements-dev.txt
	cd frontend && npm install

dev:
	docker compose -f docker-compose.dev.yml up -d
	@echo "Frontend: http://localhost:3500"
	@echo "Backend:  http://localhost:4500"
	@echo "API Docs: http://localhost:4500/docs"
	@echo "Nginx:    http://localhost:8080"

up:
	docker compose up -d
	@echo "Frontend: http://localhost:3500"
	@echo "Backend:  http://localhost:4500"
	@echo "Nginx:    http://localhost:8080"

down:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.dev.yml down

logs:
	docker compose -f docker-compose.yml logs -f

logs-backend:
	docker compose -f docker-compose.yml logs -f backend

logs-frontend:
	docker compose -f docker-compose.yml logs -f frontend

build:
	docker compose -f docker-compose.yml build

clean:
	docker compose -f docker-compose.yml down -v
	docker compose -f docker-compose.dev.yml down -v

test-backend:
	cd backend && pytest -v

test-frontend:
	cd frontend && npm run test

test: test-backend test-frontend

init-db:
	cd backend && python -m cli init-db

seed:
	cd backend && python -m cli seed
