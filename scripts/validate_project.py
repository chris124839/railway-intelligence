import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
required = [
    ".github/workflows/live-monitor.yml",
    ".github/workflows/daily-train-update.yml",
    ".github/workflows/historical-backfill.yml",
    ".github/workflows/data-quality.yml",
    ".github/workflows/maintenance.yml",
    "collector/collector.py",
    "collector/requirements.txt",
    "config/trains.json",
    "config/collection-policy.json",
    "supabase/schema.sql",
]

missing = [p for p in required if not (ROOT / p).exists()]
if missing:
    raise SystemExit("Missing required files:\n" + "\n".join(missing))

trains = json.loads((ROOT / "config" / "trains.json").read_text(encoding="utf-8"))
if not isinstance(trains, list):
    raise SystemExit("config/trains.json must contain a list")

print(f"Project validation OK. Configured trains: {len(trains)}")
for train in trains:
    print(" -", train.get("train_number"), "enabled=", train.get("enabled"))
