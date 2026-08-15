import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Encabezado } from '../components/layout/Encabezado'
import { TarjetaPerfume } from '../components/inventario/TarjetaPerfume'
import { usePerfumes } from '../hooks/usePerfumes'

export function Inventario() {
  const { perfumes, cargando, error } = usePerfumes()
  const [busqueda, setBusqueda] = useState('')

  const filtrados = perfumes.filter((p) =>
    `${p.nombre} ${p.marca}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <Encabezado titulo="Inventario" subtitulo={`${perfumes.length} perfumes disponibles`} />

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar perfume o marca…"
              className="w-full rounded-xl border border-line bg-noir-2 py-3 pl-10 pr-4 text-[15px] text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold"
            />
          </div>
          <Link
            to="/inventario/nuevo"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-noir"
          >
            <Plus size={22} />
          </Link>
        </div>

        {error && (
          <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">
            No se pudo cargar el inventario: {error}
          </p>
        )}

        {cargando && <p className="text-sm text-ivory-dim px-1">Cargando perfumes…</p>}

        {!cargando && filtrados.length === 0 && !error && (
          <div className="rounded-2xl border border-line bg-noir-2 p-8 text-center">
            <p className="text-ivory-dim text-sm">
              {perfumes.length === 0
                ? 'Aún no has agregado perfumes. Toca el botón + para agregar el primero.'
                : 'No hay perfumes que coincidan con tu búsqueda.'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtrados.map((p) => (
            <TarjetaPerfume key={p.id} perfume={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
