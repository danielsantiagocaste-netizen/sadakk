import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { CATALOGO_PERFUMES, type GeneroPerfume } from '../data/catalogoPerfumes'

const FILTROS: { id: GeneroPerfume | 'todos'; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'hombre', etiqueta: 'Hombre' },
  { id: 'mujer', etiqueta: 'Mujer' },
  { id: 'unisex', etiqueta: 'Unisex' },
]

export function CatalogoPerfumes() {
  const [busqueda, setBusqueda] = useState('')
  const [genero, setGenero] = useState<GeneroPerfume | 'todos'>('todos')
  const navegar = useNavigate()

  const agrupados = useMemo(() => {
    const filtrados = CATALOGO_PERFUMES.filter((p) => {
      if (genero !== 'todos' && p.genero !== genero) return false
      if (busqueda && !`${p.nombre} ${p.marca}`.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    })

    const porMarca = new Map<string, typeof filtrados>()
    for (const p of filtrados) {
      const lista = porMarca.get(p.marca) ?? []
      lista.push(p)
      porMarca.set(p.marca, lista)
    }
    return Array.from(porMarca.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [busqueda, genero])

  function elegir(nombre: string, marca: string) {
    navegar('/inventario/nuevo', { state: { nombre, marca } })
  }

  return (
    <div>
      <EncabezadoAtras titulo="Catálogo de perfumes" />
      <div className="p-5 flex flex-col gap-4">
        <p className="text-sm text-ivory-dim -mt-1">
          Elige un perfume para pre-llenar el nombre y la marca. Luego solo agregas costo, margen y stock.
        </p>

        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar perfume o marca…"
            className="w-full rounded-xl border border-line bg-noir-2 py-3 pl-10 pr-4 text-[15px] text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setGenero(f.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                genero === f.id ? 'border-gold bg-gold/10 text-gold' : 'border-line text-ivory-dim bg-noir-2'
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>

        {agrupados.length === 0 && (
          <div className="rounded-2xl border border-line bg-noir-2 p-8 text-center shadow-sm">
            <p className="text-ivory-dim text-sm">No hay resultados. Puedes agregar el perfume manualmente.</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {agrupados.map(([marca, perfumes]) => (
            <div key={marca}>
              <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-gold">{marca}</p>
              <div className="flex flex-col gap-2">
                {perfumes.map((p) => (
                  <button
                    key={`${p.marca}-${p.nombre}`}
                    onClick={() => elegir(p.nombre, p.marca)}
                    className="flex items-center justify-between rounded-xl border border-line bg-noir-2 px-4 py-3.5 text-left shadow-sm active:bg-noir-3"
                  >
                    <span className="text-[15px] text-ivory">{p.nombre}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
                        p.genero === 'hombre'
                          ? 'bg-gold/10 text-gold'
                          : p.genero === 'mujer'
                            ? 'bg-wine-soft text-wine'
                            : 'bg-sage-soft text-sage'
                      }`}
                    >
                      {p.genero}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ivory-dim px-4 pb-4">
          Lista de referencia con nombres y marcas de uso común en el mercado — no incluye precios ni imágenes de
          las marcas. El costo y el precio de venta siempre los defines tú.
        </p>
      </div>
    </div>
  )
}
