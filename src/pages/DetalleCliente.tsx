import { useParams } from 'react-router-dom'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { Tarjeta } from '../components/ui/Tarjeta'
import { TarjetaVenta } from '../components/ventas/TarjetaVenta'
import { useDetalleCliente } from '../hooks/useClienteDetalle'
import { formatoPesos } from '../lib/formatos'

export function DetalleCliente() {
  const { id } = useParams<{ id: string }>()
  const { resumen, cargando, error } = useDetalleCliente(id)

  if (cargando) {
    return (
      <div>
        <EncabezadoAtras titulo="Cliente" />
        <p className="p-5 text-sm text-ivory-dim">Cargando…</p>
      </div>
    )
  }

  if (error || !resumen) {
    return (
      <div>
        <EncabezadoAtras titulo="Cliente" />
        <p className="p-5 text-sm text-ivory-dim">No se pudo cargar este cliente.</p>
      </div>
    )
  }

  const { cliente, ventas, totalComprado, totalAbonado, saldoPendiente } = resumen

  return (
    <div>
      <EncabezadoAtras titulo={cliente.nombre} />
      <div className="p-5 flex flex-col gap-5">
        {cliente.telefono && <p className="text-sm text-ivory-dim -mt-2">{cliente.telefono}</p>}

        <Tarjeta className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-ivory-dim">Total comprado</span>
          <span className="tabular text-right text-ivory">{formatoPesos(totalComprado)}</span>
          <span className="text-ivory-dim">Total abonado</span>
          <span className="tabular text-right text-sage">{formatoPesos(totalAbonado)}</span>
          <span className="text-ivory-dim">Saldo pendiente</span>
          <span className="tabular text-right font-medium text-gold">{formatoPesos(saldoPendiente)}</span>
        </Tarjeta>

        <div>
          <p className="font-display text-lg text-ivory mb-3">Historial de compras</p>
          {ventas.length === 0 && (
            <Tarjeta>
              <p className="text-sm text-ivory-dim">Este cliente aún no tiene compras registradas.</p>
            </Tarjeta>
          )}
          <div className="flex flex-col gap-3">
            {ventas.map((v) => (
              <TarjetaVenta key={v.id} venta={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
