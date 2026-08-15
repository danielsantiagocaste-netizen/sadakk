import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Perfume } from '../types/database'

export interface DatosNuevoPerfume {
  nombre: string
  marca: string
  costo: number
  porcentaje_ganancia: number
  precio_venta: number
  precio_manual: boolean
  stock: number
  stock_minimo: number
  notas?: string | null
}

export function usePerfumes() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) setError(error.message)
    else setPerfumes(data ?? [])
    setCargando(false)
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function agregarPerfume(datos: DatosNuevoPerfume) {
    const { error } = await supabase.from('perfumes').insert(datos as never)
    if (error) return { error: error.message }
    await recargar()
    return { error: null }
  }

  async function actualizarPerfume(id: string, datos: Partial<DatosNuevoPerfume>) {
    const { error } = await supabase.from('perfumes').update(datos as never).eq('id', id)
    if (error) return { error: error.message }
    await recargar()
    return { error: null }
  }

  async function archivarPerfume(id: string) {
    const { error } = await supabase.from('perfumes').update({ activo: false } as never).eq('id', id)
    if (error) return { error: error.message }
    await recargar()
    return { error: null }
  }

  return { perfumes, cargando, error, recargar, agregarPerfume, actualizarPerfume, archivarPerfume }
}
