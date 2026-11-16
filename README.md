# Quantum Secret Sharing: N-party secret sharing on GHZ states

Team 6 capstone for Quantum Computing (lecturer: Ms. HENG Sovanmonynuth).

A dealer splits a 256-bit encryption key between N holders using GHZ states and the
HBB protocol, simulated with Qiskit Aer. If someone copies the shares while they are
being handed out, the check-round error rate jumps from ~0% to ~25% and the key is
thrown away. The resulting classical key then encrypts a real file with AES-256-GCM,
and the file can only be decrypted when all N holders combine their shares.

**Scenario:** an encrypted payroll database backup. Its key is split between the Security Director,
the IT Administrator and the Compliance Officer, and is restored only when all of them agree.

## Run it

### With Docker (everything in one command)

```bash
docker compose up --build        # or: make up
```

- Web app: http://localhost:3200
- API docs: http://localhost:8000/docs

Stop with `docker compose down` (or `make down`). The frontend waits for the backend's
health check before starting. Backend settings can go in `backend/.env` (see `.env.example`).

### Locally (for development, with hot reload)

Needs Node 22+ and [uv](https://docs.astral.sh/uv/).

```bash
make install
make dev          # backend :8000 + frontend :3200
```

Or run them separately with `make backend` and `make frontend`. Tests: `make test`.

## Layout

```
frontend/                      Next.js 16 (App Router) + motion
  src/app/                     layout, page, Quiet Gallery theme (globals.css)
  src/content/steps.ts         tour copy, one entry per step
  src/components/onboarding/   tour shell: copy, stage, progress rail, keyboard nav
  src/components/scenes/       one animated scene per step
  src/components/ui/           theme toggle, API status pill
  src/lib/api/                 typed client for the FastAPI backend (mirrors schemas)
  next.config.ts               proxies /api/* to the backend (API_URL)
  Dockerfile                   standalone Next.js server

backend/                       FastAPI + Qiskit (scaffolded, logic not built yet)
  app/main.py                  app factory, CORS, error handlers
  app/core/                    settings (QSS_* env vars), errors (NotImplementedError → 501)
  app/api/routes/              one router per app page; thin, delegates to services
  app/schemas/                 Pydantic request/response models (the API contract)
  app/services/                use cases: distribution, vault, comparison, experiments, threshold
  app/quantum/                 ghz, bases, simulator, hbb, sifting, eve, noise
  app/crypto/                  aes (GCM), xor_split, shamir, keys
  app/domain/                  VaultSession (holds K and shares, never sent to the client)
  app/repositories/            in-memory session store
  tests/                       health + 501 contract tests; protocol tests are xfail until built
  Dockerfile                   python 3.13 + uv, runs uvicorn on :8000

docker-compose.yml             backend + frontend, one command
```

Every stub raises `NotImplementedError("module.function")`. The API returns that as
**501 Not Implemented** with the function name in `todo`, so the frontend can show "coming
soon" while the routes and schemas are already visible in `/docs`.

## Status

| Piece | State |
|---|---|
| Onboarding tour (12 steps) | done |
| API skeleton, schemas, health check | done |
| Teaching mode (one bit in the GHZ phase) | stub · `quantum/ghz.py` |
| Full HBB: bases, sifting, check rounds | stub · `quantum/hbb.py`, `sifting.py` |
| Eve (intercept-and-resend), noise | stub · `quantum/eve.py`, `noise.py` |
| AES-GCM encrypt / unlock | stub · `crypto/aes.py`, `services/vault_service.py` |
| Classical vs quantum, experiments | stub |
| K-of-N hybrid (Shamir over quantum links) | stub · `crypto/shamir.py` |

## Owners (from the plan)

- Quantum core: Sao Visal, Chey Rotana (`app/quantum/ghz, bases, hbb, sifting, simulator`)
- Security & noise: Man Arafat, Rith Seyhak (`app/quantum/eve, noise`)
- Application: Ory Chanraksa, Keo Hengneitong (`frontend/`, `app/crypto`, `app/services`)

## References

- Hillery, Bužek & Berthiaume (1999), *Quantum secret sharing*, Phys. Rev. A 59, 1829.
- Xiao, Long, Deng & Pan (2004), *Efficient multiparty quantum-secret-sharing schemes*, Phys. Rev. A 69, 052307.
- Cleve, Gottesman & Lo (1999), *How to share a quantum secret*, PRL 83, 648.
- Basak et al. (2023), Qiskit implementation of GHZ-based secret sharing.
