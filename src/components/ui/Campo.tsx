import type { InputHTMLAttributes } from 'react'

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string
}

export function Campo({ etiqueta, className = '', id, ...props }: CampoProps) {
  const inputId = id ?? etiqueta.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm text-ivory-dim">
        {etiqueta}
      </label>
      <input
        id={inputId}
        className={`rounded-xl border border-line bg-noir-3 px-4 py-3.5 text-[16px] text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold ${className}`}
        {...props}
      />
    </div>
  )
}
