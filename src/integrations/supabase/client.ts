// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vmfyupcixxpmyhpqqmlo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZnl1cGNpeHhwbXlocHFxbWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTgxMTAsImV4cCI6MjA2NTI3NDExMH0.MW1uplVP9HG4ZlSU_Z7N-RSEvOMPnrqw_vrIrOP3mOo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);