import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hdabhdixbhcrossshpqu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkYWJoZGl4Ymhjcm9zc3NocHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTE2ODIsImV4cCI6MjA2MTcyNzY4Mn0.iwapBx7Qj5mlao19rjoC0v4cM2bTFLTk2Emb_V86zrQ";

export const supabase = createClient(supabaseUrl, supabaseKey);

