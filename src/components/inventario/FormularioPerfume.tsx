import { useEffect, useState, type FormEvent } from 'react'
import { Campo } from '../ui/Campo'
import { Boton } from '../ui/Boton'
import { formatoPesos } from '../../lib/formatos'
import { calcularPrecioSugerido, calcularPorcentajeReal } from '../../lib/calculos'
import type { Perfume } from '../../types/database'
import type { DatosNuevoPerfume } from '../../hooks/usePerfumes'

const MARGENES_RAPIDOS = [30, 40, 50, 60];

interface FormularioPerfumeProps {
  perfumeInicial?: Perfume
  onGuardar: (datos: DatosNuevoPerfume) => Promise<{ error: string | null }>
  textoBoton: string
}

export function FormularioPerfume({ perfumeInicial, onGuardar, textoBoton }: FormularioPerfumeProps) {
  const [nombre, setNombre] = useState(perfumeInicial?.nombre ?? '')
  const [marca, setMarca] = useState(perfumeInicial?.marca ?? '')
  const [costo, setCosto] = useState(perfumeInicial?.costo?.toString() ?? '')
  const [margen, setMargen] = useState(perfumeInicial?.porcentaje_ganancia ?? 50)
  const [precioManualActivo, setPrecioManualActivo] = useState(perfumeInicial?.precio_manual ?? false)
  const [precioManual, setPrecioManual] = useState(perfumeInicial?.precio_venta?.toString() ?? '')
  const [stock, setStock] = useState(perfumeInicial?.stock?.toString() ?? '')
  const [stockMinimo, setStockMinimo] = useState(perfumeInicial?.stock_minimo?.toString() ?? '3')
  const [notas, setNotas] = useState(perfumeInicial?.notas ?? '')
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const costoNum = parseFloat(costo) || 0
  const precioSugerido = calcularPrecioSugerido(costoNum, margen)
  const precioFinal = precioManualActivo ? parseFloat(precioManual) || 0 : precioSugerido
  const gananciaFinal = precioFinal - costoNum

  // Si el usuario edita el precio manual, mantenemos el margen mostrado sincronizado
  useEffect(() => {
    if (precioManualActivo && costoNum > 0 && precioManual) {
      const pct = calcularPorcentajeReal(costoNum, parseFloat(precioManual) || 0)
      setMargen(pct)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precioManual, precioManualActivo])

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!nombre.trim() || !marca.trim()) {
      setError('El nombre y la marca son obligatorios.')
      return
    }
    if (costoNum <= 0) {
      setError('El costo debe ser mayor a cero.')
      return
    }
    if (precioFinal <= 0) {
      setError('El precio de venta debe ser mayor a cero.')
      return
    }

    setGuardando(true)
    const { error } = await onGuardar({
      nombre: nombre.trim(),
      marca: marca.trim(),
      costo: costoNum,
      porcentaje_ganancia: margen,
      precio_venta: precioFinal,
      precio_manual: precioManualActivo,
      stock: parseInt(stock || '0', 10),
      stock_minimo: parseInt(stockMinimo || '3', 10),
      notas: notas.trim() || null,
    })
    setGuardando(false)

    if (error) setError(error)
  }

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-5 p-5">
      <Campo etiqueta="Nombre del perfume" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <Campo etiqueta="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />

      <Campo
        etiqueta="Costo para SADAK"
        type="number"
        inputMode="decimal"
        min={0}
        value={costo}
        onChange={(e) => setCosto(e.target.value)}
        required
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ivory-dim">Margen de ganancia</span>
          <button
            type="button"
            onClick={() => setPrecioManualActivo((v) => !v)}
            className="text-xs text-gold underline underline-offset-2"
          >
            {precioManualActivo ? 'Usar cálculo automático' : 'Fijar precio manualmente'}
          </button>
        </div>

        {!precioManualActivo && (
          <>
            <div className="flex gap-2">
              {MARGENES_RAPIDOS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMargen(m)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm transition ${
                    margen === m
                      ? 'border-gold bg-gold text-ivory font-semibold'
                      : 'border-line bg-noir-3 text-ivory-dim'
                  }`}
                >
                  {m}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={200}
              value={margen}
              onChange={(e) => setMargen(parseInt(e.target.value, 10))}
              className="accent-[#C6A15B]"
            />
            <p className="text-right text-sm text-ivory-dim">{margen}% de ganancia</p>
          </>
        )}

        {precioManualActivo && (
          <Campo
            etiqueta="Precio de venta manual"
            type="number"
            inputMode="decimal"
            min={0}
            value={precioManual}
            onChange={(e) => setPrecioManual(e.target.value)}
          />
        )}
      </div>

      <div className="rounded-xl border border-line bg-noir-3 p-4">
        <p className="text-xs text-ivory-dim">Costo + Ganancia = Precio de venta</p>
        <div className="tabular mt-2 flex items-center justify-between text-sm">
          <span className="text-ivory-dim">{formatoPesos(costoNum)} + {formatoPesos(gananciaFinal)}</span>
          <span className="font-display text-xl text-gold">{formatoPesos(precioFinal)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo
          etiqueta="Cantidad en stock"
          type="number"
          inputMode="numeric"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <Campo
          etiqueta="Alertar si baja de"
          type="number"
          inputMode="numeric"
          min={0}
          value={stockMinimo}
          onChange={(e) => setStockMinimo(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notas" className="text-sm text-ivory-dim">Notas (opcional)</label>
        <textarea
          id="notas"
          rows={3}
          value={notas ?? ''}
          onChange={(e) => setNotas(e.target.value)}
          className="rounded-xl border border-line bg-noir-3 px-4 py-3.5 text-[16px] text-ivory outline-none focus:border-gold resize-none"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">{error}</p>
      )}

      <Boton type="submit" disabled={guardando} className="w-full">
        {guardando ? 'Guardando…' : textoBoton}
      </Boton>
    </form>
  )
}
