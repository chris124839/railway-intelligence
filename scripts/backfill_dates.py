import argparse
import datetime as dt
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def dates(start: dt.date, end: dt.date):
    if end < start:
        raise ValueError("date_to must be on or after date_from")
    current = start
    while current <= end:
        yield current
        current += dt.timedelta(days=1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", required=True)
    parser.add_argument("--date-from", required=True)
    parser.add_argument("--date-to", required=True)
    args = parser.parse_args()

    start = dt.date.fromisoformat(args.date_from)
    end = dt.date.fromisoformat(args.date_to)
    count = 0
    for day in dates(start, end):
        count += 1
        print(f"Backfilling {args.train} for {day.isoformat()} ({count})")
        subprocess.run(
            [
                sys.executable,
                "-m",
                "collector.collector",
                "--train",
                args.train,
                "--date",
                day.isoformat(),
            ],
            cwd=ROOT,
            check=True,
        )


if __name__ == "__main__":
    main()
