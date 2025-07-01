import { createClient} from '@supabase/supabase-js'

const supabaseURL = 'https://nnhydbofxchtboynqizi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaHlkYm9meGNodGJveW5xaXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzg4NzMsImV4cCI6MjA2NjcxNDg3M30.vlZE3uP7o9QoiD9lSYSU6IfoWjNBolwEPjxjNzbu4XY';

export const supabase = createClient(supabaseURL,supabaseAnonKey)
