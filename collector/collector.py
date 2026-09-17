import os
import argparse
import datetime as dt
import requests
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

RAILRADAR_API_KEY = os.getenv("RAILRADAR_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def iso_date():
    return dt.datetime.now(dt.timezone(dt.timedelta(hours=5, minutes=30))).date().isoformat()

def fetch_railradar(train_number: str, journey_date: str | None = None):
    if not RAILRADAR_API_KEY:
        raise RuntimeError("RAILRADAR_API_KEY is not configured")
    date = journey_date or iso_date()
    url = f"https://api.railradar.in/v1/trains/{train_number}/live"
    r = requests.get(
        url,
        params={"date": date},
        headers={"Authorization": f"Bearer {RAILRADAR_API_KEY}"},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()

def supabase_client():
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise RuntimeError("Supabase credentials are not configured")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def upsert_snapshot(sb, train_number, journey_date, payload):
    data = payload.get("data", payload)
    current = data.get("currentLocation") or {}
    previous = data.get("previousHalt") or {}
    nxt = data.get("nextHalt") or {}
    row = {
        "train_number": train_number,
        "journey_date": journey_date,
        "status": data.get("status"),
        "delay_minutes": data.get("delayMinutes"),
        "current_station_code": current.get("stationCode") or previous.get("stationCode"),
        "current_station_name": current.get("stationName") or previous.get("stationName"),
        "next_station_code": nxt.get("stationCode"),
        "next_station_name": nxt.get("stationName"),
        "latitude": current.get("lat"),
        "longitude": current.get("lng"),
        "payload": payload,
    }
    sb.table("live_snapshots").insert(row).execute()
    return row

def upsert_route_events(sb, train_number, journey_date, payload):
    data = payload.get("data", payload)
    route = data.get("route") or []
    run = {
        "train_number": train_number,
        "journey_date": journey_date,
        "status": data.get("status"),
        "last_updated": data.get("lastUpdatedAt"),
    }
    result = sb.table("train_runs").upsert(run, on_conflict="train_number,journey_date").execute()
    run_id = result.data[0]["id"]

    written = 0
    for s in route:
        row = {
            "run_id": run_id,
            "train_number": train_number,
            "journey_date": journey_date,
            "station_code": s.get("stationCode"),
            "sequence": s.get("sequence"),
            "scheduled_arrival": s.get("scheduledArrival"),
            "scheduled_departure": s.get("scheduledDeparture"),
            "actual_arrival": s.get("actualArrival"),
            "actual_departure": s.get("actualDeparture"),
            "arrival_delay": s.get("delayArrival"),
            "departure_delay": s.get("delayDeparture"),
            "platform": s.get("platform"),
            "status": s.get("status"),
            "source": "railradar",
        }
        # station may not exist yet; station seed should be loaded separately.
        try:
            sb.table("station_events").upsert(
                row, on_conflict="run_id,station_code,sequence"
            ).execute()
            written += 1
        except Exception as exc:
            print("station event skipped:", s.get("stationCode"), exc)
    return written

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--train", default="17250")
    ap.add_argument("--date", default=None)
    args = ap.parse_args()

    journey_date = args.date or iso_date()
    payload = fetch_railradar(args.train, journey_date)
    sb = supabase_client()

    upsert_snapshot(sb, args.train, journey_date, payload)
    count = upsert_route_events(sb, args.train, journey_date, payload)
    print({"train": args.train, "journey_date": journey_date, "route_events": count})

if __name__ == "__main__":
    main()
