import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { EstadoVenta, MetodoPago, VentaDetalle } from '../types/database'

export interface FiltrosVentas {
  busqueda: string
  estado: EstadoVenta | 'todos'
  metodo_pago: MetodoPago | 'todos'
  desde: string // yyyy-mm-dd
  hasta: string // yyyy-mm-dd
}

export const filtrosVacios: FiltrosVentas = {
  busqueda: '',
  estado: 'todos',
  metodo_pago: 'todos',
  desde: '',
  hasta: '',
}

export function useVentasLista() {
  const [ventas, setVentas] = useState<VentaDetalle[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    const { data, error } = await supabase
      .from('vista_ventas_detalle')
      .select('*')
      .order('fecha', { ascending: false })

    if (error) setError(error.message)
    else setVentas((data ?? []) as unknown as VentaDetalle[])
    setCargando(false)
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ventas, cargando, error, recargar }
}

export function filtrarVentas(ventas: VentaDetalle[], f: FiltrosVentas): VentaDetalle[] {
  return ventas.filter((v) => {
    if (f.estado !== 'todos' && v.estado !== f.estado) return false
    if (f.metodo_pago !== 'todos' && v.metodo_pago !== f.metodo_pago) return false

    if (f.desde && new Date(v.fecha) < new Date(f.desde)) return false
    if (f.hasta && new Date(v.fecha) > new Date(f.hasta + 'T23:59:59')) return false

    if (f.busqueda) {
      const texto = `${v.cliente_nombre} ${v.perfume_nombre} ${v.perfume_marca}`.toLowerCase()
      if (!texto.includes(f.busqueda.toLowerCase())) return false
    }

    return true
  })
}
