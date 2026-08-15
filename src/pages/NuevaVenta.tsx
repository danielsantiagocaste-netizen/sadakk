import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { Campo } from '../components/ui/Campo'
import { Boton } from '../components/ui/Boton'
import { SelectorPerfume } from '../components/ventas/SelectorPerfume'
import { SelectorCliente } from '../components/ventas/SelectorCliente'
import { SelectorMetodoPago } from '../components/ventas/SelectorMetodoPago'
import { usePerfumes } from '../hooks/usePerfumes'
import { useVentas } from '../hooks/useVentas'
import { formatoPesos } from '../lib/formatos'
import type { Perfume, Cliente, MetodoPago } from '../types/database'

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

export function NuevaVenta() {
  const { perfumes } = usePerfumes()
  const { crearVenta } = useVentas()
  const navegar = useNavigate()

  const [perfume, setPerfume] = useState<Perfume | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [cantidad, setCantidad] = useState('1')
  const [precioVenta, setPrecioVenta] = useState('')
  const [fecha, setFecha] = useState(hoyISO())
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [abonoInicial, setAbonoInicial] = useState('')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cantidadNum = parseInt(cantidad || '0', 10)
  const precioUnitario = precioVenta ? parseFloat(precioVenta) : perfume?.precio_venta ?? 0
  const precioTotal = precioUnitario * cantidadNum
  const abonoNum = parseFloat(abonoInicial || '0')
  const saldoRestante = Math.max(0, precioTotal - abonoNum)

  function manejarSeleccionPerfume(p: Perfume) {
    setPerfume(p)
    setPrecioVenta(p.precio_venta.toString())
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!perfume) return setError('Selecciona un perfume.')
    if (!cliente) return setError('Selecciona un cliente.')
    if (cantidadNum <= 0) return setError('La cantidad debe ser mayor a cero.')
    if (cantidadNum > perfume.stock) return setError(`Solo hay ${perfume.stock} unidades disponibles.`)
    if (precioUnitario <= 0) return setError('El precio de venta debe ser mayor a cero.')
    if (abonoNum > precioTotal) return setError('El abono inicial no puede ser mayor al total de la venta.')

    setGuardando(true)
    const { venta, error } = await crearVenta({
      perfume_id: perfume.id,
      cliente_id: cliente.id,
      cantidad: cantidadNum,
      costo_unitario: perfume.costo,
      precio_unitario: precioUnitario,
      metodo_pago: metodoPago,
      fecha: new Date(fecha).toISOString(),
      notas: notas.trim() || null,
      abono_inicial: abonoNum > 0 ? abonoNum : undefined,
    })
    setGuardando(false)

    if (error) return setError(error)
    if (venta) navegar(`/ventas/${venta.id}`)
  }

  return (
    <div>
      <EncabezadoAtras titulo="Nueva venta" />
      <form onSubmit={manejarEnvio} className="flex flex-col gap-5 p-5">
        <div>
          <label className="mb-1.5 block text-sm text-ivory-dim">Perfume</label>
          <SelectorPerfume perfumes={perfumes} seleccionado={perfume} onSeleccionar={manejarSeleccionPerfume} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ivory-dim">Cliente</label>
          <SelectorCliente seleccionado={cliente} onSeleccionar={setCliente} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Campo
            etiqueta="Cantidad"
            type="number"
            inputMode="numeric"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <Campo
            etiqueta="Precio de venta (c/u)"
            type="number"
            inputMode="decimal"
            min={0}
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
          />
        </div>

        <Campo etiqueta="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <div>
          <label className="mb-1.5 block text-sm text-ivory-dim">Método de pago</label>
          <SelectorMetodoPago valor={metodoPago} onCambiar={setMetodoPago} />
        </div>

        <Campo
          etiqueta="Abono inicial (opcional)"
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="0"
          value={abonoInicial}
          onChange={(e) => setAbonoInicial(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notas-venta" className="text-sm text-ivory-dim">Notas (opcional)</label>
          <textarea
            id="notas-venta"
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="rounded-xl border border-line bg-noir-3 px-4 py-3.5 text-[16px] text-ivory outline-none focus:border-gold resize-none"
          />
        </div>

        {perfume && (
          <div className="rounded-xl border border-line bg-noir-3 p-4 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ivory-dim">Total de la venta</span>
              <span className="tabular text-ivory">{formatoPesos(precioTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ivory-dim">Abono inicial</span>
              <span className="tabular text-sage">{formatoPesos(abonoNum)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-1.5 mt-1">
              <span className="text-ivory-dim">Saldo pendiente</span>
              <span className="tabular font-medium text-gold">{formatoPesos(saldoRestante)}</span>
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">{error}</p>
        )}

        <Boton type="submit" disabled={guardando} className="w-full">
          {guardando ? 'Guardando venta…' : 'Guardar venta'}
        </Boton>
      </form>
    </div>
  )
}
