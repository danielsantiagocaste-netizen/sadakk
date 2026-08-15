import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Cliente } from '../types/database'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    setCargando(true)
    const { data } = await supabase.from('clientes').select('*').order('nombre', { ascending: true })
    setClientes(data ?? [])
    setCargando(false)
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function crearCliente(nombre: string, telefono?: string | null) {
    const { data, error } = await supabase
      .from('clientes')
      .insert({ nombre, telefono: telefono || null } as never)
      .select()
      .single()
    if (error) return { cliente: null, error: error.message }
    await recargar()
    return { cliente: data as unknown as Cliente, error: null }
  }

  return { clientes, cargando, recargar, crearCliente }
}
