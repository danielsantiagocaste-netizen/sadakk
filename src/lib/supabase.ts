import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey || anonKey.includes('PEGA_AQUI')) {
  // eslint-disable-next-line no-console
  console.warn(
    '[SADAK] Falta configurar VITE_SUPABASE_ANON_KEY en el archivo .env — la app no podrá conectarse a la base de datos hasta que lo agregues.'
  )
}

export const supabase = createClient<Database>(url, anonKey)
