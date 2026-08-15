import logoSadak from '../../assets/logo-sadak.png'

interface EncabezadoProps {
  titulo: string
  subtitulo?: string
}

export function Encabezado({ titulo, subtitulo }: EncabezadoProps) {
  return (
    <header className="mist border-b border-line px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <img src={logoSadak} alt="SADAK" className="mb-3 h-8 w-auto rounded-lg" />
      <h1 className="font-display text-2xl text-ivory mt-0.5">{titulo}</h1>
      {subtitulo && <p className="text-sm text-ivory-dim mt-1">{subtitulo}</p>}
    </header>
  )
}
