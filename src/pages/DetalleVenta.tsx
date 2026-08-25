import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { Tarjeta } from '../components/ui/Tarjeta'
import { InsigniaEstado } from '../components/ventas/InsigniaEstado'
import { useVentaDetalle, useVentas } from '../hooks/useVentas'
import { useAbonos } from '../hooks/useAbonos'
import { formatoPesos, formatoFecha, formatoFechaHora } from '../lib/formatos'

export function DetalleVenta() {
  const { id } = useParams<{ id: string }>()
  const { venta, cargando, error } = useVentaDetalle(id)
  const { abonos, cargando: cargandoAbonos } = useAbonos(id)
  const { eliminarVenta } = useVentas()
  const navegar = useNavigate()
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  if (cargando) {
    return (
      <div>
        <EncabezadoAtras titulo="Venta" />
        <p className="p-5 text-sm text-ivory-dim">Cargando…</p>
      </div>
    )
  }

  if (error || !venta) {
    return (
      <div>
        <EncabezadoAtras titulo="Venta" />
        <p className="p-5 text-sm text-ivory-dim">No se pudo cargar esta venta.</p>
      </div>
    )
  }

  const metodoLabel = venta.metodo_pago === 'efectivo' ? 'Efectivo' : 'Transferencia'

  async function manejarEliminar() {
    if (!id || !venta) return

    const advertencia =
      venta.total_abonado > 0
        ? `Esta venta tiene ${formatoPesos(venta.total_abonado)} en abonos registrados. Al eliminarla se borran también esos abonos, y las ${venta.cantidad} unidades de "${venta.perfume_nombre}" vuelven al inventario. Esta acción no se puede deshacer. ¿Continuar?`
        : `Las ${venta.cantidad} unidades de "${venta.perfume_nombre}" volverán al inventario. Esta acción no se puede deshacer. ¿Continuar?`

    if (!window.confirm(advertencia)) return

    setEliminando(true)
    setErrorEliminar(null)
    const { error } = await eliminarVenta(id)
    setEliminando(false)

    if (error) {
      setErrorEliminar(error)
      return
    }
    navegar('/ventas')
  }

  return (
    <div>
      <EncabezadoAtras titulo={venta.perfume_nombre} />

      <div className="p-5 flex flex-col gap-5">
        {/* Información de la venta */}
        <Tarjeta className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-ivory">{venta.cliente_nombre}</p>
            <InsigniaEstado estado={venta.estado} />
          </div>
          {venta.cliente_telefono && <p className="text-xs text-ivory-dim">{venta.cliente_telefono}</p>}

          <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-ivory-dim">Perfume</span>
            <span className="text-right text-ivory">{venta.perfume_nombre} · {venta.perfume_marca}</span>
            <span className="text-ivory-dim">Cantidad</span>
            <span className="text-right text-ivory">{venta.cantidad}</span>
            <span className="text-ivory-dim">Fecha</span>
            <span className="text-right text-ivory">{formatoFecha(venta.fecha)}</span>
            <span className="text-ivory-dim">Método de pago</span>
            <span className="text-right text-ivory">{metodoLabel}</span>
            <span className="text-ivory-dim">Precio (c/u)</span>
            <span className="tabular text-right text-ivory">{formatoPesos(venta.precio_unitario)}</span>
            <span className="text-ivory-dim">Costo (c/u)</span>
            <span className="tabular text-right text-ivory">{formatoPesos(venta.costo_unitario)}</span>
            <span className="text-ivory-dim">Ganancia</span>
            <span className="tabular text-right text-sage">{formatoPesos(venta.ganancia_total)}</span>
          </div>

          {venta.notas && (
            <p className="mt-1 rounded-lg bg-noir-3 p-3 text-sm text-ivory-dim">{venta.notas}</p>
          )}
        </Tarjeta>

        {/* Pagos */}
        <Tarjeta className="flex flex-col gap-2">
          <p className="font-display text-lg text-ivory mb-1">Pagos</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-ivory-dim">Total</span>
            <span className="tabular text-right text-ivory">{formatoPesos(venta.precio_total)}</span>
            <span className="text-ivory-dim">Abonado</span>
            <span className="tabular text-right text-sage">{formatoPesos(venta.total_abonado)}</span>
            <span className="text-ivory-dim">Saldo</span>
            <span className="tabular text-right font-medium text-gold">{formatoPesos(venta.saldo)}</span>
          </div>
        </Tarjeta>

        {/* Historial de abonos */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg text-ivory">Historial de abonos</p>
            {venta.estado === 'pendiente' && (
              <Link
                to={`/ventas/${venta.id}/abono`}
                className="flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-medium text-ivory"
              >
                <Plus size={14} /> Registrar abono
              </Link>
            )}
          </div>

          {cargandoAbonos && <p className="text-sm text-ivory-dim">Cargando abonos…</p>}

          {!cargandoAbonos && abonos.length === 0 && (
            <Tarjeta>
              <p className="text-sm text-ivory-dim">Aún no se han registrado abonos para esta venta.</p>
            </Tarjeta>
          )}

          <div className="flex flex-col gap-2">
            {abonos.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-line bg-noir-2 p-3.5"
              >
                <div>
                  <p className="tabular text-[15px] text-ivory">{formatoPesos(a.valor)}</p>
                  <p className="text-xs text-ivory-dim">
                    {formatoFechaHora(a.fecha)} · {a.metodo_pago === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                  </p>
                  {a.nota && <p className="text-xs text-ivory-dim mt-0.5">{a.nota}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {venta.estado === 'completo' && (
          <div className="rounded-xl border border-sage/40 bg-sage-soft px-4 py-3 text-center text-sm text-sage">
            Esta venta está completamente pagada.
          </div>
        )}

        {errorEliminar && (
          <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">
            {errorEliminar}
          </p>
        )}

        <button
          onClick={manejarEliminar}
          disabled={eliminando}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-wine/50 py-3.5 text-sm text-wine disabled:opacity-50"
        >
          <Trash2 size={16} /> {eliminando ? 'Eliminando…' : 'Eliminar venta'}
        </button>
      </div>
    </div>
  )
}
