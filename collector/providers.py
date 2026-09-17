"""
Provider interface.

The production collector should use one or more adapters:
- RailRadarAdapter: API key based live/route provider
- NTESAdapter: official public enquiry source, best-effort and subject to upstream changes

Keep normalized output independent of the provider so the dashboard/database do not
change when the source changes.
"""

from dataclasses import dataclass
from typing import Any

@dataclass
class NormalizedStation:
    sequence: int
    station_code: str
    station_name: str | None
    scheduled_arrival: str | None
    scheduled_departure: str | None
    actual_arrival: str | None
    actual_departure: str | None
    arrival_delay: int | None
    departure_delay: int | None
    platform: str | None
    status: str | None

@dataclass
class NormalizedRun:
    train_number: str
    journey_date: str
    status: str | None
    delay_minutes: int | None
    current_station_code: str | None
    current_station_name: str | None
    next_station_code: str | None
    next_station_name: str | None
    stations: list[NormalizedStation]
    raw: dict[str, Any]
