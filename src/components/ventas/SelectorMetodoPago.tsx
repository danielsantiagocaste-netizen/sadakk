import { Banknote, Landmark } from 'lucide-react'
import type { MetodoPago } from '../../types/database'

interface SelectorMetodoPagoProps {
  valor: MetodoPago
  onCambiar: (metodo: MetodoPago) => void
}

export function SelectorMetodoPago({ valor, onCambiar }: SelectorMetodoPagoProps) {
  const opciones: { id: MetodoPago; etiqueta: string; icono: typeof Banknote }[] = [
    { id: 'efectivo', etiqueta: 'Efectivo', icono: Banknote },
    { id: 'transferencia', etiqueta: 'Transferencia', icono: Landmark },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {opciones.map(({ id, etiqueta, icono: Icono }) => (
        <button
          key={id}
          type="button"
          onClick={() => onCambiar(id)}
          className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition ${
            valor === id
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-line bg-noir-3 text-ivory-dim'
          }`}
        >
          <Icono size={22} />
          <span className="text-sm">{etiqueta}</span>
        </button>
      ))}
    </div>
  )
}
