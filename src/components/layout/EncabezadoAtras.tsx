import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export function EncabezadoAtras({ titulo }: { titulo: string }) {
  const navegar = useNavigate()
  return (
    <header className="flex items-center gap-3 border-b border-line px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <button
        onClick={() => navegar(-1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-noir-2 text-ivory shadow-sm"
        aria-label="Volver"
      >
        <ChevronLeft size={20} />
      </button>
      <h1 className="font-display text-lg text-ivory">{titulo}</h1>
    </header>
  )
}
