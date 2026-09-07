import { useRef, useState, type FormEvent } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { responderPregunta } from '../lib/asistente'

interface Mensaje {
  rol: 'usuario' | 'asistente'
  texto: string
}

const PREGUNTAS_SUGERIDAS = [
  'Ventas de este mes',
  'Perfumes con poco stock',
  'Cuál es el perfume más vendido',
  'Pendiente por cobrar',
]

export function Asistente() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: 'asistente',
      texto:
        'Hola, soy el asistente de SADAK. Pregúntame por precios, stock, ventas o deudas de clientes — por ejemplo: "precio de Sauvage" o "ventas de este mes".',
    },
  ])
  const [pregunta, setPregunta] = useState('')
  const [enviando, setEnviando] = useState(false)
  const finRef = useRef<HTMLDivElement>(null)

  async function enviarPregunta(texto: string) {
    if (!texto.trim() || enviando) return
    setMensajes((m) => [...m, { rol: 'usuario', texto }])
    setPregunta('')
    setEnviando(true)

    try {
      const respuesta = await responderPregunta(texto)
      setMensajes((m) => [...m, { rol: 'asistente', texto: respuesta }])
    } catch {
      setMensajes((m) => [
        ...m,
        { rol: 'asistente', texto: 'Tuve un problema consultando la información. Intenta de nuevo.' },
      ])
    } finally {
      setEnviando(false)
      setTimeout(() => finRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    enviarPregunta(pregunta)
  }

  return (
    <div className="flex flex-col h-svh">
      <EncabezadoAtras titulo="Asistente" />

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] whitespace-pre-line ${
              m.rol === 'usuario'
                ? 'self-end bg-gold text-ivory rounded-br-sm'
                : 'self-start bg-noir-2 border border-line text-ivory rounded-bl-sm shadow-sm'
            }`}
          >
            {m.texto}
          </div>
        ))}
        {enviando && (
          <div className="self-start rounded-2xl rounded-bl-sm border border-line bg-noir-2 px-4 py-3 text-sm text-ivory-dim shadow-sm">
            Consultando…
          </div>
        )}
        <div ref={finRef} />
      </div>

      {mensajes.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto px-5 pb-2">
          {PREGUNTAS_SUGERIDAS.map((p) => (
            <button
              key={p}
              onClick={() => enviarPregunta(p)}
              className="shrink-0 rounded-full border border-line bg-noir-2 px-3.5 py-2 text-xs text-ivory-dim flex items-center gap-1.5"
            >
              <Sparkles size={12} className="text-gold" /> {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={manejarEnvio}
        className="flex items-center gap-2 border-t border-line bg-noir-2 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
      >
        <input
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Pregunta por un perfume, venta o cliente…"
          className="flex-1 rounded-xl border border-line bg-noir-3 px-4 py-3 text-[16px] text-ivory outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={enviando || !pregunta.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-ivory disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
