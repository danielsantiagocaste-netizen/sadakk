import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { VentaDetalle } from '../types/database'

export type PeriodoGanancias = 'todo' | 'hoy' | 'semana' | 'mes' | 'personalizado'

export interface RangoFechas {
  desde: string // yyyy-mm-dd
  hasta: string // yyyy-mm-dd
}

export function calcularRango(periodo: PeriodoGanancias, personalizado: RangoFechas): RangoFechas | null {
  const hoy = new Date()
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  if (periodo === 'todo') {
    return null // sin filtro de fecha: trae todo el histórico
  }
  if (periodo === 'hoy') {
    return { desde: fmt(hoy), hasta: fmt(hoy) }
  }
  if (periodo === 'semana') {
    const inicio = new Date(hoy)
    inicio.setDate(hoy.getDate() - hoy.getDay())
    return { desde: fmt(inicio), hasta: fmt(hoy) }
  }
  if (periodo === 'mes') {
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    return { desde: fmt(inicio), hasta: fmt(hoy) }
  }
  return personalizado
}

export interface ResumenGanancias {
  ventasTotales: number
  costoTotal: number
  gananciaTotal: number
  dineroCobrado: number
  dineroPendiente: number
  numeroVentas: number
}

export function useGanancias(rango: RangoFechas | null) {
  const [resumen, setResumen] = useState<ResumenGanancias | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      let query = supabase.from('vista_ventas_detalle').select('*')
      if (rango) {
        query = query.gte('fecha', rango.desde).lte('fecha', rango.hasta + 'T23:59:59')
      }
      const { data } = await query

      const ventas = (data ?? []) as unknown as VentaDetalle[]

      setResumen({
        ventasTotales: ventas.reduce((acc, v) => acc + v.precio_total, 0),
        costoTotal: ventas.reduce((acc, v) => acc + v.costo_unitario * v.cantidad, 0),
        gananciaTotal: ventas.reduce((acc, v) => acc + v.ganancia_total, 0),
        dineroCobrado: ventas.reduce((acc, v) => acc + v.total_abonado, 0),
        dineroPendiente: ventas.reduce((acc, v) => acc + v.saldo, 0),
        numeroVentas: ventas.length,
      })
      setCargando(false)
    }
    cargar()
  }, [rango?.desde, rango?.hasta])

  return { resumen, cargando }
}
