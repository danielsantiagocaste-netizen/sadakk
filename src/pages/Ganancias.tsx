import { useState } from 'react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { Tarjeta } from '../components/ui/Tarjeta'
import { useGanancias, calcularRango, type PeriodoGanancias, type RangoFechas } from '../hooks/useGanancias'
import { formatoPesos } from '../lib/formatos'

const PERIODOS: { id: PeriodoGanancias; etiqueta: string }[] = [
  { id: 'todo', etiqueta: 'Todo' },
  { id: 'hoy', etiqueta: 'Hoy' },
  { id: 'semana', etiqueta: 'Esta semana' },
  { id: 'mes', etiqueta: 'Este mes' },
  { id: 'personalizado', etiqueta: 'Personalizado' },
]

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

export function Ganancias() {
  const [periodo, setPeriodo] = useState<PeriodoGanancias>('todo')
  const [personalizado, setPersonalizado] = useState<RangoFechas>({ desde: hoyISO(), hasta: hoyISO() })

  const rango = calcularRango(periodo, personalizado)
  const { resumen, cargando } = useGanancias(rango)

  return (
    <div>
      <EncabezadoAtras titulo="Ganancias" />
      <div className="p-5 flex flex-col gap-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodo(p.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                periodo === p.id ? 'border-gold bg-gold/10 text-gold' : 'border-line text-ivory-dim'
              }`}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        {periodo === 'personalizado' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs text-ivory-dim">Desde</p>
              <input
                type="date"
                value={personalizado.desde}
                onChange={(e) => setPersonalizado({ ...personalizado, desde: e.target.value })}
                className="w-full rounded-lg border border-line bg-noir-3 px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold"
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs text-ivory-dim">Hasta</p>
              <input
                type="date"
                value={personalizado.hasta}
                onChange={(e) => setPersonalizado({ ...personalizado, hasta: e.target.value })}
                className="w-full rounded-lg border border-line bg-noir-3 px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold"
              />
            </div>
          </div>
        )}

        {cargando && <p className="text-sm text-ivory-dim px-1">Calculando…</p>}

        {resumen && (
          <>
            <Tarjeta className="text-center">
              <p className="text-xs text-ivory-dim">
                {periodo === 'todo' ? 'Ganancia general (todo el histórico)' : 'Ganancia del periodo'}
              </p>
              <p className="tabular font-display text-4xl text-sage mt-1">{formatoPesos(resumen.gananciaTotal)}</p>
              <p className="text-xs text-ivory-dim mt-1">{resumen.numeroVentas} ventas</p>
            </Tarjeta>

            <Tarjeta className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-ivory-dim">Ventas</span>
                <span className="tabular text-ivory">{formatoPesos(resumen.ventasTotales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ivory-dim">Costo</span>
                <span className="tabular text-ivory">{formatoPesos(resumen.costoTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3">
                <span className="text-sm text-ivory-dim">Ganancia</span>
                <span className="tabular font-medium text-sage">{formatoPesos(resumen.gananciaTotal)}</span>
              </div>
            </Tarjeta>

            <Tarjeta className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-ivory-dim">Cobrado</span>
                <span className="tabular text-sage">{formatoPesos(resumen.dineroCobrado)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ivory-dim">Pendiente</span>
                <span className="tabular text-gold">{formatoPesos(resumen.dineroPendiente)}</span>
              </div>
            </Tarjeta>

            <p className="text-xs text-ivory-dim text-center px-4">
              La ganancia se calcula como precio de venta − costo real del perfume. No debe confundirse con el
              dinero cobrado, que puede ser menor si hay ventas con saldo pendiente.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
