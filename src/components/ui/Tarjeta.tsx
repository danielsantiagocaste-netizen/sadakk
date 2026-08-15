import type { HTMLAttributes, ReactNode } from 'react'

interface TarjetaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Tarjeta({ children, className = '', ...props }: TarjetaProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-noir-2 p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
