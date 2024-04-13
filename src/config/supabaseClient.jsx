import { createClient } from '@supabase/supabase-js'

const REACT_APP_SUPABASE_URL='https://wnjgfpwljoffljktknzw.supabase.co'
const REACT_APP_SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduamdmcHdsam9mZmxqa3Rrbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5NDc3NzAsImV4cCI6MjAyODUyMzc3MH0.aEpolOv9QYJ9mKTOO4IiuncaG5PvTjVbErpWknRxoIk'

const supabaseUrl = REACT_APP_SUPABASE_URL
const supabaseKey = REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase