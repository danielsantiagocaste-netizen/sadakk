import { Link } from 'react-router-dom'
import { formatoPesos, formatoFecha } from '../../lib/formatos'
import { InsigniaEstado } from './InsigniaEstado'
import type { VentaDetalle } from '../../types/database'

export function TarjetaVenta({ venta }: { venta: VentaDetalle }) {
  return (
    <Link
      to={`/ventas/${venta.id}`}
      className="flex items-center justify-between rounded-2xl border border-line bg-noir-2 p-4 active:bg-noir-3 transition"
    >
      <div className="min-w-0">
        <p className="truncate text-[15px] font-medium text-ivory">{venta.cliente_nombre}</p>
        <p className="truncate text-xs text-ivory-dim">{venta.perfume_nombre}</p>
        <p className="text-xs text-ivory-dim mt-1">{formatoFecha(venta.fecha)}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="tabular text-[15px] text-ivory">{formatoPesos(venta.precio_total)}</span>
        <InsigniaEstado estado={venta.estado} />
      </div>
    </Link>
  )
}
