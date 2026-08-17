import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Falls back to placeholder values so the app never crashes at import time
// (e.g. during a build without env vars configured). Real calls will fail
// gracefully instead, and the UI surfaces a clear message.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey);
