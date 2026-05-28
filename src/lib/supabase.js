import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
export const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("As chaves do Supabase não foram encontradas no .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)