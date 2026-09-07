import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Perfume, VentaDetalle } from '../types/database'

export interface DatosDashboard {
  ventasTotales: number
  perfumesVendidosTotal: number
  totalVendido: number
  totalCobrado: number
  pendienteCobrar: number
  gananciaTotal: number
  perfumesDisponibles: number
  perfumesStockBajo: Perfume[]
}

export function useDashboard() {
  const [datos, setDatos] = useState<DatosDashboard | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const [{ data: ventas }, { data: perfumes }] = await Promise.all([
        supabase.from('vista_ventas_detalle').select('*'),
        supabase.from('perfumes').select('*').eq('activo', true),
      ])

      const listaVentas = (ventas ?? []) as unknown as VentaDetalle[]
      const listaPerfumes = (perfumes ?? []) as unknown as Perfume[]

      setDatos({
        ventasTotales: listaVentas.length,
        perfumesVendidosTotal: listaVentas.reduce((acc, v) => acc + v.cantidad, 0),
        totalVendido: listaVentas.reduce((acc, v) => acc + v.precio_total, 0),
        totalCobrado: listaVentas.reduce((acc, v) => acc + v.total_abonado, 0),
        pendienteCobrar: listaVentas.reduce((acc, v) => acc + v.saldo, 0),
        gananciaTotal: listaVentas.reduce((acc, v) => acc + v.ganancia_total, 0),
        perfumesDisponibles: listaPerfumes.length,
        perfumesStockBajo: listaPerfumes.filter((p) => p.stock <= p.stock_minimo),
      })
      setCargando(false)
    }
    cargar()
  }, [])

  return { datos, cargando }
}
