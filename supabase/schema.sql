create extension if not exists pgcrypto;

create table if not exists trains (
  train_number text primary key,
  train_name text,
  source_code text,
  source_name text,
  destination_code text,
  destination_name text,
  run_days jsonb,
  distance_km numeric,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists stations (
  station_code text primary key,
  station_name text not null,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

create table if not exists train_schedules (
  id bigint generated always as identity primary key,
  train_number text references trains(train_number),
  station_code text references stations(station_code),
  sequence integer not null,
  scheduled_arrival timestamptz,
  scheduled_departure timestamptz,
  halt_minutes integer,
  distance_km numeric,
  effective_from date,
  effective_to date,
  source text,
  unique(train_number, station_code, sequence, effective_from)
);

create table if not exists train_runs (
  id uuid primary key default gen_random_uuid(),
  train_number text references trains(train_number),
  journey_date date not null,
  status text,
  started_at timestamptz,
  completed_at timestamptz,
  last_updated timestamptz default now(),
  unique(train_number, journey_date)
);

create table if not exists station_events (
  id bigint generated always as identity primary key,
  run_id uuid references train_runs(id) on delete cascade,
  train_number text references trains(train_number),
  journey_date date not null,
  station_code text references stations(station_code),
  sequence integer not null,
  scheduled_arrival timestamptz,
  scheduled_departure timestamptz,
  actual_arrival timestamptz,
  actual_departure timestamptz,
  arrival_delay integer,
  departure_delay integer,
  platform text,
  status text,
  source text,
  observed_at timestamptz default now(),
  unique(run_id, station_code, sequence)
);

create table if not exists live_snapshots (
  id bigint generated always as identity primary key,
  train_number text references trains(train_number),
  journey_date date not null,
  observed_at timestamptz not null default now(),
  status text,
  delay_minutes integer,
  current_station_code text,
  current_station_name text,
  next_station_code text,
  next_station_name text,
  latitude numeric,
  longitude numeric,
  payload jsonb
);

create table if not exists collection_logs (
  id bigint generated always as identity primary key,
  workflow_name text,
  train_number text,
  journey_date date,
  started_at timestamptz default now(),
  finished_at timestamptz,
  status text,
  records_written integer default 0,
  error_message text
);

create index if not exists idx_station_events_train_date
  on station_events(train_number, journey_date);

create index if not exists idx_station_events_station
  on station_events(station_code, journey_date);

create index if not exists idx_live_snapshots_train_time
  on live_snapshots(train_number, journey_date, observed_at desc);

-- Useful dashboard view
create or replace view train_17250_station_summary as
select
  station_code,
  count(*) filter (where arrival_delay is not null) as samples,
  round(avg(arrival_delay)) as avg_arrival_delay,
  percentile_cont(0.5) within group (order by arrival_delay)
    filter (where arrival_delay is not null) as median_arrival_delay,
  round(100.0 * avg(case when arrival_delay <= 5 then 1 else 0 end), 1)
    as on_time_pct
from station_events
where train_number = '17250'
group by station_code;
