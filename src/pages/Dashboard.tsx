import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Encabezado } from '../components/layout/Encabezado'
import { Tarjeta } from '../components/ui/Tarjeta'
import { Estadistica } from '../components/ui/Estadistica'
import { AccesosRapidos } from '../components/dashboard/AccesosRapidos'
import { useDashboard } from '../hooks/useDashboard'
import { formatoPesos } from '../lib/formatos'

export function Dashboard() {
  const { datos, cargando } = useDashboard()

  return (
    <div>
      <Encabezado titulo="Inicio" subtitulo="Resumen del negocio" />

      <div className="p-5 flex flex-col gap-6">
        <AccesosRapidos />

        {cargando && <p className="text-sm text-ivory-dim px-1">Cargando resumen…</p>}

        {datos && (
          <>
            {datos.perfumesStockBajo.length > 0 && (
              <Link
                to="/inventario"
                className="flex items-center gap-3 rounded-xl border border-wine/40 bg-wine-soft px-4 py-3"
              >
                <AlertTriangle size={18} className="text-wine shrink-0" />
                <p className="text-sm text-wine">
                  {datos.perfumesStockBajo.length === 1
                    ? '1 perfume con pocas unidades'
                    : `${datos.perfumesStockBajo.length} perfumes con pocas unidades`}
                </p>
              </Link>
            )}

            <div>
              <p className="mb-3 font-display text-lg text-ivory">Ventas</p>
              <Tarjeta className="grid grid-cols-3 gap-4">
                <Estadistica etiqueta="Hoy" valor={String(datos.ventasHoy)} destacado tono="gold" />
                <Estadistica etiqueta="Este mes" valor={String(datos.ventasMes)} destacado />
                <Estadistica etiqueta="Perfumes vendidos" valor={String(datos.perfumesVendidosMes)} destacado />
              </Tarjeta>
            </div>

            <div>
              <p className="mb-3 font-display text-lg text-ivory">Dinero</p>
              <Tarjeta className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-sm text-ivory-dim">Total vendido (mes)</span>
                  <span className="tabular text-ivory">{formatoPesos(datos.totalVendidoMes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ivory-dim">Total cobrado (mes)</span>
                  <span className="tabular text-sage">{formatoPesos(datos.totalCobradoMes)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <span className="text-sm text-ivory-dim">Pendiente por cobrar</span>
                  <span className="tabular font-medium text-gold">{formatoPesos(datos.pendienteCobrarMes)}</span>
                </div>
              </Tarjeta>
            </div>

            <div>
              <p className="mb-3 font-display text-lg text-ivory">Ganancias</p>
              <Tarjeta className="grid grid-cols-2 gap-4">
                <Estadistica etiqueta="Ganancia del día" valor={formatoPesos(datos.gananciaHoy)} destacado tono="sage" />
                <Estadistica etiqueta="Ganancia del mes" valor={formatoPesos(datos.gananciaMes)} destacado tono="sage" />
              </Tarjeta>
            </div>

            <div>
              <p className="mb-3 font-display text-lg text-ivory">Inventario</p>
              <Tarjeta className="grid grid-cols-2 gap-4">
                <Estadistica etiqueta="Perfumes disponibles" valor={String(datos.perfumesDisponibles)} destacado />
                <Estadistica
                  etiqueta="Con pocas unidades"
                  valor={String(datos.perfumesStockBajo.length)}
                  destacado
                  tono={datos.perfumesStockBajo.length > 0 ? 'wine' : 'ivory'}
                />
              </Tarjeta>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
