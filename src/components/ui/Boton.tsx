import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'fantasma' | 'peligro'
  children: ReactNode
}

const estilos: Record<string, string> = {
  primario:
    'bg-gold text-noir font-semibold hover:brightness-110 active:brightness-95',
  secundario:
    'bg-noir-3 text-ivory border border-line hover:bg-[#332e27]',
  fantasma:
    'bg-transparent text-ivory-dim hover:text-ivory',
  peligro:
    'bg-wine text-ivory hover:brightness-110',
}

export function Boton({ variante = 'primario', className = '', children, ...props }: BotonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] transition disabled:opacity-40 disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
