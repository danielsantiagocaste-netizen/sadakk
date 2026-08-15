import type { EstadoVenta } from '../../types/database'

export function InsigniaEstado({ estado }: { estado: EstadoVenta }) {
  const esCompleto = estado === 'completo'
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        esCompleto ? 'bg-sage-soft text-sage' : 'bg-wine-soft text-wine'
      }`}
    >
      {esCompleto ? 'COMPLETO' : 'PENDIENTE'}
    </span>
  )
}
