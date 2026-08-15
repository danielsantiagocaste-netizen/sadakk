import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Abono, MetodoPago } from '../types/database'

export function useAbonos(ventaId: string | undefined) {
  const [abonos, setAbonos] = useState<Abono[]>([])
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    if (!ventaId) return
    setCargando(true)
    const { data } = await supabase
      .from('abonos')
      .select('*')
      .eq('venta_id', ventaId)
      .order('fecha', { ascending: false })
    setAbonos(data ?? [])
    setCargando(false)
  }, [ventaId])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function registrarAbono(valor: number, metodo_pago: MetodoPago, fecha: string, nota?: string | null) {
    if (!ventaId) return { error: 'Venta no válida' }
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('abonos').insert({
      venta_id: ventaId,
      valor,
      metodo_pago,
      fecha,
      nota: nota || null,
      creado_por: user?.id,
    } as never)

    if (error) {
      // El trigger de la base de datos rechaza abonos que superen el saldo con un mensaje claro
      return { error: error.message.includes('supera el saldo') ? error.message : error.message }
    }
    await recargar()
    return { error: null }
  }

  return { abonos, cargando, recargar, registrarAbono }
}
