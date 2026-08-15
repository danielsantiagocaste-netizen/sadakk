import marcaSadak from '../../assets/marca-sadak.png'

interface EncabezadoProps {
  titulo: string
  subtitulo?: string
}

export function Encabezado({ titulo, subtitulo }: EncabezadoProps) {
  return (
    <header className="mist border-b border-line px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="mb-3 flex items-center gap-2.5">
        <img src={marcaSadak} alt="SADAK" className="h-8 w-8 rounded-lg" />
        <span className="font-display italic text-lg text-ivory">Sadak</span>
      </div>
      <h1 className="font-display text-2xl text-ivory mt-0.5">{titulo}</h1>
      {subtitulo && <p className="text-sm text-ivory-dim mt-1">{subtitulo}</p>}
    </header>
  )
}
