import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { FiltrosVentas } from '../../hooks/useVentasLista'

interface PanelFiltrosProps {
  filtros: FiltrosVentas
  onCambiar: (f: FiltrosVentas) => void
}

export function PanelFiltrosVentas({ filtros, onCambiar }: PanelFiltrosProps) {
  const [abierto, setAbierto] = useState(false)

  const hayFiltrosActivos =
    filtros.estado !== 'todos' || filtros.metodo_pago !== 'todos' || filtros.desde || filtros.hasta

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
          hayFiltrosActivos ? 'border-gold text-gold' : 'border-line text-ivory-dim'
        }`}
      >
        <SlidersHorizontal size={15} />
        Filtros
        {hayFiltrosActivos && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
      </button>

      {abierto && (
        <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-line bg-noir-2 p-4">
          <div>
            <p className="mb-2 text-xs text-ivory-dim">Estado</p>
            <div className="flex gap-2">
              {(['todos', 'pendiente', 'completo'] as const).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => onCambiar({ ...filtros, estado: e })}
                  className={`flex-1 rounded-lg border py-2 text-xs capitalize ${
                    filtros.estado === e ? 'border-gold bg-gold/10 text-gold' : 'border-line text-ivory-dim'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-ivory-dim">Método de pago</p>
            <div className="flex gap-2">
              {(['todos', 'efectivo', 'transferencia'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onCambiar({ ...filtros, metodo_pago: m })}
                  className={`flex-1 rounded-lg border py-2 text-xs capitalize ${
                    filtros.metodo_pago === m ? 'border-gold bg-gold/10 text-gold' : 'border-line text-ivory-dim'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs text-ivory-dim">Desde</p>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) => onCambiar({ ...filtros, desde: e.target.value })}
                className="w-full rounded-lg border border-line bg-noir-3 px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs text-ivory-dim">Hasta</p>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) => onCambiar({ ...filtros, hasta: e.target.value })}
                className="w-full rounded-lg border border-line bg-noir-3 px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
              />
            </div>
          </div>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={() => onCambiar({ ...filtros, estado: 'todos', metodo_pago: 'todos', desde: '', hasta: '' })}
              className="text-xs text-ivory-dim underline underline-offset-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
