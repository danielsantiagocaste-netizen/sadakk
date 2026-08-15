import { useState } from 'react'
import { Search, Check } from 'lucide-react'
import { formatoPesos } from '../../lib/formatos'
import type { Perfume } from '../../types/database'

interface SelectorPerfumeProps {
  perfumes: Perfume[]
  seleccionado: Perfume | null
  onSeleccionar: (perfume: Perfume) => void
}

export function SelectorPerfume({ perfumes, seleccionado, onSeleccionar }: SelectorPerfumeProps) {
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)

  const filtrados = perfumes.filter((p) =>
    `${p.nombre} ${p.marca}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-noir-3 px-4 py-3.5 text-left"
      >
        {seleccionado ? (
          <div>
            <p className="text-[15px] text-ivory">{seleccionado.nombre}</p>
            <p className="text-xs text-ivory-dim">
              {seleccionado.marca} · {formatoPesos(seleccionado.precio_venta)} · {seleccionado.stock} und disponibles
            </p>
          </div>
        ) : (
          <span className="text-ivory-dim">Seleccionar perfume…</span>
        )}
        <Search size={17} className="text-ivory-dim" />
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-gold bg-noir-3 p-3">
      <div className="relative mb-2">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-dim" />
        <input
          autoFocus
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar perfume…"
          className="w-full rounded-lg border border-line bg-noir-2 py-2.5 pl-9 pr-3 text-sm text-ivory outline-none focus:border-gold"
        />
      </div>
      <div className="max-h-56 overflow-y-auto flex flex-col gap-1">
        {filtrados.length === 0 && (
          <p className="p-3 text-center text-sm text-ivory-dim">Sin resultados</p>
        )}
        {filtrados.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={p.stock === 0}
            onClick={() => {
              onSeleccionar(p)
              setAbierto(false)
              setBusqueda('')
            }}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-noir-2 disabled:opacity-40"
          >
            <div>
              <p className="text-sm text-ivory">{p.nombre}</p>
              <p className="text-xs text-ivory-dim">
                {p.marca} · {formatoPesos(p.precio_venta)} · {p.stock === 0 ? 'Sin stock' : `${p.stock} und`}
              </p>
            </div>
            {seleccionado?.id === p.id && <Check size={16} className="text-gold" />}
          </button>
        ))}
      </div>
    </div>
  )
}
