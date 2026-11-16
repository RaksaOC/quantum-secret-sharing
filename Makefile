.PHONY: install backend frontend dev test typecheck up down logs

## --- Local (no Docker) ---
install:            ## install both apps
	cd backend && uv sync
	cd frontend && npm install

backend:            ## FastAPI on :8000 (docs at /docs)
	cd backend && uv run uvicorn app.main:app --reload --port 8000

frontend:           ## Next.js on :3200
	cd frontend && npm run dev

dev:                ## both, in one terminal
	$(MAKE) -j2 backend frontend

test:
	cd backend && uv run pytest -q

typecheck:
	cd frontend && npm run typecheck

## --- Docker ---
up:                 ## build and start everything in containers
	docker compose up --build -d
	@echo "Web: http://localhost:3200   API docs: http://localhost:8000/docs"

down:
	docker compose down

logs:
	docker compose logs -f
