# 5project MVP

Moodle-based MVP for a school project marketplace and learning flow.

## Run locally

```bash
docker compose up -d --build
```

Open http://localhost:8080.

On first start MariaDB restores `moodle_db.sql.gz` and then applies `db-init/002_mvp_defaults.sql`: Russian locale, Moscow timezone, public front page, `vanilla` product theme, and the 5project site name.

If a database volume already exists and you need a clean restore:

```bash
docker compose down -v
docker compose up -d --build
```

## Runtime configuration

Set `MOODLE_WWWROOT` for non-local environments:

```bash
MOODLE_WWWROOT=https://example.com docker compose up -d --build
```
