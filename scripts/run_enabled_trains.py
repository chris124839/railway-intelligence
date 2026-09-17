import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "trains.json"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["live", "daily"], required=True)
    args = parser.parse_args()

    trains = json.loads(CONFIG.read_text(encoding="utf-8"))
    selected = [t for t in trains if t.get("enabled") and t.get("collect_live")]
    if not selected:
        print("No enabled trains configured.")
        return

    for train in selected:
        number = str(train["train_number"])
        print(f"Collecting train {number} ({args.mode})")
        subprocess.run(
            [sys.executable, "-m", "collector.collector", "--train", number],
            cwd=ROOT,
            check=True,
        )


if __name__ == "__main__":
    main()
