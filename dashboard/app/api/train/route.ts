import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const train = searchParams.get("train") || "17250";
  const date = searchParams.get("date") || new Date().toISOString().slice(0,10);
  const sb = getSupabaseServer();
  if (!sb) return NextResponse.json({ connected: false, train, date });

  const [run, events, snapshot] = await Promise.all([
    sb.from("train_runs").select("*").eq("train_number", train).eq("journey_date", date).maybeSingle(),
    sb.from("station_events").select("*").eq("train_number", train).eq("journey_date", date).order("sequence"),
    sb.from("live_snapshots").select("*").eq("train_number", train).eq("journey_date", date).order("observed_at", {ascending:false}).limit(1).maybeSingle()
  ]);
  return NextResponse.json({connected:true, train, date, run:run.data, events:events.data||[], snapshot:snapshot.data, errors:[run.error?.message,events.error?.message,snapshot.error?.message].filter(Boolean)});
}
