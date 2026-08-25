import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { MetodoPago, VentaDetalle } from '../types/database'

export interface DatosNuevaVenta {
  perfume_id: string
  cliente_id: string
  cantidad: number
  costo_unitario: number
  precio_unitario: number
  metodo_pago: MetodoPago
  fecha: string
  notas?: string | null
  abono_inicial?: number
}

export function useVentas() {
  async function crearVenta(datos: DatosNuevaVenta) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: venta, error: errorVenta } = await supabase
      .from('ventas')
      .insert({
        perfume_id: datos.perfume_id,
        cliente_id: datos.cliente_id,
        cantidad: datos.cantidad,
        costo_unitario: datos.costo_unitario,
        precio_unitario: datos.precio_unitario,
        metodo_pago: datos.metodo_pago,
        fecha: datos.fecha,
        notas: datos.notas || null,
        creado_por: user?.id,
      } as never)
      .select()
      .single()

    if (errorVenta) return { venta: null, error: errorVenta.message }

    const ventaCreada = venta as unknown as { id: string }

    if (datos.abono_inicial && datos.abono_inicial > 0) {
      const { error: errorAbono } = await supabase.from('abonos').insert({
        venta_id: ventaCreada.id,
        valor: datos.abono_inicial,
        metodo_pago: datos.metodo_pago,
        fecha: datos.fecha,
        creado_por: user?.id,
      } as never)

      if (errorAbono) {
        // La venta ya se creó; el abono falló (ej. por alguna validación). Reportamos pero no revertimos
        // automáticamente para no perder el registro de inventario ya descontado.
        return { venta: ventaCreada, error: `Venta creada, pero el abono inicial falló: ${errorAbono.message}` }
      }
    }

    return { venta: ventaCreada, error: null }
  }

  async function eliminarVenta(id: string) {
    // Al eliminar la venta, la base de datos automáticamente:
    // - borra sus abonos (ON DELETE CASCADE)
    // - devuelve el stock del perfume (trigger trg_venta_eliminada)
    const { error } = await supabase.from('ventas').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  }

  return { crearVenta, eliminarVenta }
}

export function useVentaDetalle(id: string | undefined) {
  const [venta, setVenta] = useState<VentaDetalle | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    if (!id) return
    setCargando(true)
    const { data, error } = await supabase
      .from('vista_ventas_detalle')
      .select('*')
      .eq('id', id)
      .single()

    if (error) setError(error.message)
    else setVenta(data as unknown as VentaDetalle)
    setCargando(false)
  }, [id])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { venta, cargando, error, recargar }
}
