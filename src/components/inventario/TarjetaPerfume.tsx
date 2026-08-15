import { Link } from 'react-router-dom'
import { formatoPesos } from '../../lib/formatos'
import type { Perfume } from '../../types/database'

export function TarjetaPerfume({ perfume }: { perfume: Perfume }) {
  const gananciaUnidad = perfume.precio_venta - perfume.costo
  const stockBajo = perfume.stock <= perfume.stock_minimo

  return (
    <Link
      to={`/inventario/${perfume.id}`}
      className="flex items-center gap-4 rounded-2xl border border-line bg-noir-2 p-4 active:bg-noir-3 transition"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-noir-3 border border-line">
        <span className="font-display text-lg text-gold">
          {perfume.marca.slice(0, 1).toUpperCase()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ivory">{perfume.nombre}</p>
        <p className="text-xs text-ivory-dim">{perfume.marca}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs">
          <span className="tabular text-gold">{formatoPesos(perfume.precio_venta)}</span>
          <span className="tabular text-sage">+{formatoPesos(gananciaUnidad)}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={`tabular rounded-full px-2.5 py-1 text-xs font-medium ${
            stockBajo ? 'bg-wine-soft text-wine' : 'bg-sage-soft text-sage'
          }`}
        >
          {perfume.stock} und
        </span>
        {stockBajo && <span className="text-[10px] text-wine">Stock bajo</span>}
      </div>
    </Link>
  )
}
