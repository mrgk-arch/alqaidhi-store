import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amlebejrtintiahekjda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbGViZWpydGludGlhaGVramRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NzY3NTEsImV4cCI6MjEwNjU1Mjc1MX0.VQdbcU1sWnUVdU8bANNawiyi2-_EC7U7LW6Wec1J7bs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);