import type { HTMLAttributes, ReactNode } from 'react'

interface TarjetaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Tarjeta({ children, className = '', ...props }: TarjetaProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-noir-2 p-5 shadow-sm shadow-black/[0.03] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
