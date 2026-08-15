import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { Campo } from '../components/ui/Campo'
import { Boton } from '../components/ui/Boton'
import { Tarjeta } from '../components/ui/Tarjeta'
import { SelectorMetodoPago } from '../components/ventas/SelectorMetodoPago'
import { useVentaDetalle } from '../hooks/useVentas'
import { useAbonos } from '../hooks/useAbonos'
import { formatoPesos } from '../lib/formatos'
import type { MetodoPago } from '../types/database'

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

export function RegistrarAbono() {
  const { id } = useParams<{ id: string }>()
  const { venta, cargando } = useVentaDetalle(id)
  const { registrarAbono } = useAbonos(id)
  const navegar = useNavigate()

  const [valor, setValor] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [fecha, setFecha] = useState(hoyISO())
  const [nota, setNota] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  if (cargando || !venta) {
    return (
      <div>
        <EncabezadoAtras titulo="Registrar abono" />
        <p className="p-5 text-sm text-ivory-dim">Cargando…</p>
      </div>
    )
  }

  const valorNum = parseFloat(valor || '0')

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (valorNum <= 0) return setError('El abono debe ser mayor a cero.')
    if (valorNum > venta!.saldo) {
      return setError(`Este abono supera el saldo pendiente de ${formatoPesos(venta!.saldo)}.`)
    }

    setGuardando(true)
    const { error } = await registrarAbono(valorNum, metodoPago, new Date(fecha).toISOString(), nota.trim() || null)
    setGuardando(false)

    if (error) return setError(error)
    navegar(`/ventas/${id}`)
  }

  return (
    <div>
      <EncabezadoAtras titulo="Registrar abono" />
      <div className="p-5 flex flex-col gap-5">
        <Tarjeta className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ivory-dim">{venta.cliente_nombre} · {venta.perfume_nombre}</p>
            <p className="text-xs text-ivory-dim mt-0.5">Saldo pendiente</p>
          </div>
          <p className="tabular font-display text-xl text-gold">{formatoPesos(venta.saldo)}</p>
        </Tarjeta>

        <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
          <Campo
            etiqueta="Valor del abono"
            type="number"
            inputMode="decimal"
            min={0}
            max={venta.saldo}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />

          <Campo etiqueta="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

          <div>
            <label className="mb-1.5 block text-sm text-ivory-dim">Método de pago</label>
            <SelectorMetodoPago valor={metodoPago} onCambiar={setMetodoPago} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nota-abono" className="text-sm text-ivory-dim">Nota (opcional)</label>
            <input
              id="nota-abono"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="rounded-xl border border-line bg-noir-3 px-4 py-3.5 text-[16px] text-ivory outline-none focus:border-gold"
            />
          </div>

          {valorNum > 0 && (
            <p className="text-sm text-ivory-dim">
              Saldo después de este abono:{' '}
              <span className="tabular text-ivory">{formatoPesos(Math.max(0, venta.saldo - valorNum))}</span>
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">{error}</p>
          )}

          <Boton type="submit" disabled={guardando} className="w-full">
            {guardando ? 'Registrando…' : 'Registrar abono'}
          </Boton>
        </form>
      </div>
    </div>
  )
}
