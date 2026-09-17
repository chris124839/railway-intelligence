# Data-source assessment

## Kaggle

Useful datasets found during the initial assessment:

- "Indian Railways: Predict Train Delay" — 1.5M journey records in `ir_train.csv`
  plus 375k test records. Useful for ML experimentation, but it is a competition
  dataset and should not be treated as the historical operational database for 17250.
- "Indian Railway Delay Dataset" — describes 2016–2025 selected-train records, but
  the dataset author explicitly says it is manually prepared/simulated for learning.
- "Indian Railways Train Delays Dataset 2025" — 1,900 train-station combinations,
  aggregated delay statistics scraped from ETrain.info in September 2025.
- "Indian Railways Dataset" — schedule/static data, including train/station schedule
  objects and train GeoJSON; useful for route/timetable seeding, not actual event history.

Conclusion: Kaggle can seed static/synthetic/ML data, but it is not a dependable
raw historical event source for 17250.

## Official railway sources

The Indian Railways passenger reservation enquiry site exposes train schedules.
CRIS/NTES exposes current running status and ETA/ETD. These are the preferred
reference sources for timetable and live-status validation.

There is no documented unrestricted free official historical API that we should
assume we can call every day for all trains.

## RailRadar

RailRadar's documented live API provides route records with scheduled/actual
arrival/departure, delays, status, station sequence, etc. Its legacy endpoint
accepts a journey date. The current free sandbox is 1,000 requests/month.

This is suitable for the 17250 MVP, not enough by itself for unrestricted
nationwide high-frequency polling.

## Public history sites

RunningStatus.in currently exposes a 365-day punctuality history for 17250,
including station-wise averages and run-history rows. This proves that historical
data exists publicly, and it can be used for validation/backfill experiments.
For production collection, check the site's terms/robots and obtain permission
before relying on scraping.

## Recommended strategy

Static:
  official schedule / public schedule -> local schedule table

Live:
  RailRadar free API initially

Validation:
  NTES / official Indian Railways

Historical:
  permitted public historical source + our own daily collection

Long-term:
  add a licensed/approved provider adapter if the product scales.
