# Postgres backup (dump)

> M8 ops note. Local compose: Postgres 17, host port **5435**, DB/user `getpersona`.

## When

Take a dump before schema experiments, self-host upgrades, or any restore drill. Prefer a quiet window; dump is online-safe for MVP size.

## Dump (custom format)

From the host (compose maps `5435 → 5432`):

```bash
# Requires pg_dump 17+ (or run inside the postgres container)
pg_dump \
  --host=127.0.0.1 --port=5435 \
  --username=getpersona \
  --dbname=getpersona \
  --format=custom \
  --file="getpersona-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

Or via Podman/Docker exec:

```bash
podman compose exec -T postgres \
  pg_dump -U getpersona -d getpersona -Fc \
  > "getpersona-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

Set `PGPASSWORD` (or `.pgpass`) from local `.env` / Infisical — never commit credentials.

## Restore (smoke)

```bash
pg_restore \
  --host=127.0.0.1 --port=5435 \
  --username=getpersona \
  --dbname=getpersona \
  --clean --if-exists \
  path/to/getpersona-….dump
```

Only restore into a disposable DB unless you intend to overwrite.

## Out of scope here

- Continuous WAL / PITR
- Offsite retention policy
- Automated cron (add later if ops requires it)
