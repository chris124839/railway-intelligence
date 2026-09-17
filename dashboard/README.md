# Dashboard

Next.js dashboard for the railway punctuality system.

The current screen is intentionally **map-free** as requested.
Replace the hard-coded demo values in `components/Dashboard.tsx` with Supabase queries
after the database is seeded.

Production steps:
1. Add Supabase environment variables.
2. Create server-side queries for `train_runs`, `station_events`, `live_snapshots`.
3. Add train search and date filters.
4. Deploy to Vercel.
