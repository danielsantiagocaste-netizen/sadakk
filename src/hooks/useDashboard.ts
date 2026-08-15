import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Perfume, VentaDetalle } from '../types/database'

function esHoy(fechaISO: string) {
  const f = new Date(fechaISO)
  const hoy = new Date()
  return f.toDateString() === hoy.toDateString()
}

function esEsteMes(fechaISO: string) {
  const f = new Date(fechaISO)
  const hoy = new Date()
  return f.getFullYear() === hoy.getFullYear() && f.getMonth() === hoy.getMonth()
}

export interface DatosDashboard {
  ventasHoy: number
  ventasMes: number
  perfumesVendidosMes: number
  totalVendidoMes: number
  totalCobradoMes: number
  pendienteCobrarMes: number
  gananciaHoy: number
  gananciaMes: number
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

      const ventasHoyLista = listaVentas.filter((v) => esHoy(v.fecha))
      const ventasMesLista = listaVentas.filter((v) => esEsteMes(v.fecha))

      setDatos({
        ventasHoy: ventasHoyLista.length,
        ventasMes: ventasMesLista.length,
        perfumesVendidosMes: ventasMesLista.reduce((acc, v) => acc + v.cantidad, 0),
        totalVendidoMes: ventasMesLista.reduce((acc, v) => acc + v.precio_total, 0),
        totalCobradoMes: ventasMesLista.reduce((acc, v) => acc + v.total_abonado, 0),
        pendienteCobrarMes: ventasMesLista.reduce((acc, v) => acc + v.saldo, 0),
        gananciaHoy: ventasHoyLista.reduce((acc, v) => acc + v.ganancia_total, 0),
        gananciaMes: ventasMesLista.reduce((acc, v) => acc + v.ganancia_total, 0),
        perfumesDisponibles: listaPerfumes.length,
        perfumesStockBajo: listaPerfumes.filter((p) => p.stock <= p.stock_minimo),
      })
      setCargando(false)
    }
    cargar()
  }, [])

  return { datos, cargando }
}
