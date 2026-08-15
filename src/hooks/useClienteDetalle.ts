import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Cliente, VentaDetalle } from '../types/database'

export interface ResumenCliente {
  cliente: Cliente
  ventas: VentaDetalle[]
  totalComprado: number
  totalAbonado: number
  saldoPendiente: number
}

export function useDetalleCliente(id: string | undefined) {
  const [resumen, setResumen] = useState<ResumenCliente | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    if (!id) return
    setCargando(true)
    setError(null)

    const [{ data: cliente, error: errorCliente }, { data: ventas, error: errorVentas }] = await Promise.all([
      supabase.from('clientes').select('*').eq('id', id).single(),
      supabase
        .from('vista_ventas_detalle')
        .select('*')
        .eq('cliente_id', id)
        .order('fecha', { ascending: false }),
    ])

    if (errorCliente) setError(errorCliente.message)
    else if (errorVentas) setError(errorVentas.message)
    else if (cliente) {
      const listaVentas = (ventas ?? []) as unknown as VentaDetalle[]
      setResumen({
        cliente: cliente as unknown as Cliente,
        ventas: listaVentas,
        totalComprado: listaVentas.reduce((acc, v) => acc + v.precio_total, 0),
        totalAbonado: listaVentas.reduce((acc, v) => acc + v.total_abonado, 0),
        saldoPendiente: listaVentas.reduce((acc, v) => acc + v.saldo, 0),
      })
    }
    setCargando(false)
  }, [id])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { resumen, cargando, error, recargar }
}

export interface ResumenClienteLista {
  cliente: Cliente
  totalComprado: number
  saldoPendiente: number
}

export function useClientesConSaldo() {
  const [lista, setLista] = useState<ResumenClienteLista[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const [{ data: clientes }, { data: ventas }] = await Promise.all([
        supabase.from('clientes').select('*').order('nombre', { ascending: true }),
        supabase.from('vista_ventas_detalle').select('*'),
      ])

      const listaVentas = (ventas ?? []) as unknown as VentaDetalle[]
      const listaClientes = (clientes ?? []) as unknown as Cliente[]

      setLista(
        listaClientes.map((c) => {
          const ventasCliente = listaVentas.filter((v) => v.cliente_id === c.id)
          return {
            cliente: c,
            totalComprado: ventasCliente.reduce((acc, v) => acc + v.precio_total, 0),
            saldoPendiente: ventasCliente.reduce((acc, v) => acc + v.saldo, 0),
          }
        })
      )
      setCargando(false)
    }
    cargar()
  }, [])

  return { lista, cargando }
}
