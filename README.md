# Railway Intelligence

A railway punctuality and historical-performance platform, starting with train **17250** and designed to expand to more trains.

## Current MVP

- Live snapshots for configured trains
- Station-by-station scheduled vs actual timing data
- Historical run storage in Supabase
- GitHub Actions automation
- Next.js dashboard
- No map in the dashboard

## GitHub Actions workflows

- `live-monitor.yml` — hourly live collection
- `daily-train-update.yml` — daily refresh
- `historical-backfill.yml` — manual date-range backfill
- `data-quality.yml` — configuration/data-quality checks
- `maintenance.yml` — maintenance checks

## Important: API quota

The initial configuration uses one train and conservative polling because the planned provider free allowance is limited. Historical backfill is **manual** so we do not accidentally consume the monthly quota.

## Secrets required in GitHub

Repository → Settings → Secrets and variables → Actions → New repository secret:

- `RAILRADAR_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Never commit these values to GitHub or put them in the source files.

## Project structure

```text
.github/workflows/   automation
collector/            Python data collector
config/               train list + collection policy
scripts/              automation helpers
supabase/             database schema
dashboard/            Next.js dashboard
docs/                 data-source notes
```
