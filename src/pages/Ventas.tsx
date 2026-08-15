import { useState } from 'react'
import { Search } from 'lucide-react'
import { Encabezado } from '../components/layout/Encabezado'
import { TarjetaVenta } from '../components/ventas/TarjetaVenta'
import { PanelFiltrosVentas } from '../components/ventas/PanelFiltrosVentas'
import { useVentasLista, filtrarVentas, filtrosVacios, type FiltrosVentas } from '../hooks/useVentasLista'

export function Ventas() {
  const { ventas, cargando, error } = useVentasLista()
  const [filtros, setFiltros] = useState<FiltrosVentas>(filtrosVacios)

  const filtradas = filtrarVentas(ventas, filtros)

  return (
    <div>
      <Encabezado titulo="Ventas" subtitulo={`${ventas.length} ventas registradas`} />

      <div className="p-5 flex flex-col gap-4">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim" />
          <input
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            placeholder="Buscar cliente o perfume…"
            className="w-full rounded-xl border border-line bg-noir-2 py-3 pl-10 pr-4 text-[15px] text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold"
          />
        </div>

        <PanelFiltrosVentas filtros={filtros} onCambiar={setFiltros} />

        {error && (
          <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">
            No se pudieron cargar las ventas: {error}
          </p>
        )}

        {cargando && <p className="text-sm text-ivory-dim px-1">Cargando ventas…</p>}

        {!cargando && filtradas.length === 0 && !error && (
          <div className="rounded-2xl border border-line bg-noir-2 p-8 text-center">
            <p className="text-ivory-dim text-sm">
              {ventas.length === 0
                ? 'Aún no has registrado ninguna venta.'
                : 'No hay ventas que coincidan con estos filtros.'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtradas.map((v) => (
            <TarjetaVenta key={v.id} venta={v} />
          ))}
        </div>
      </div>
    </div>
  )
}
