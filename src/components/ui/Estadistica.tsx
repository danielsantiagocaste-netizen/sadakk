interface EstadisticaProps {
  etiqueta: string
  valor: string
  destacado?: boolean
  tono?: 'ivory' | 'gold' | 'sage' | 'wine'
}

const tonos: Record<string, string> = {
  ivory: 'text-ivory',
  gold: 'text-gold',
  sage: 'text-sage',
  wine: 'text-wine',
}

export function Estadistica({ etiqueta, valor, destacado, tono = 'ivory' }: EstadisticaProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-ivory-dim">{etiqueta}</span>
      <span className={`tabular font-display ${destacado ? 'text-2xl' : 'text-lg'} ${tonos[tono]}`}>
        {valor}
      </span>
    </div>
  )
}
