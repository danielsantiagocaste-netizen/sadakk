import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Campo } from '../components/ui/Campo'
import { Boton } from '../components/ui/Boton'
import marcaSadak from '../assets/marca-sadak.png'

export function Login() {
  const { iniciarSesion } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    const { error } = await iniciarSesion(email, password)
    setEnviando(false)
    if (error) setError(error)
  }

  return (
    <div className="escena-perfumeria flex min-h-svh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={marcaSadak}
            alt="SADAK"
            className="mb-5 h-24 w-24 rounded-3xl shadow-xl shadow-black/40"
          />
          <h1 className="font-display italic text-4xl text-[#F8F1E4]">Sadak</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E3B573] mt-1">Parfum</p>
          <p className="text-sm text-[#D9CBB8] mt-4">Control interno de inventario y ventas</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-noir-2/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-md">
          <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
            <Campo
              etiqueta="Correo"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Campo
              etiqueta="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-xl border border-wine bg-wine-soft px-4 py-3 text-sm text-ivory">
                {error}
              </p>
            )}

            <Boton type="submit" disabled={enviando} className="mt-2 w-full">
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </Boton>
          </form>
        </div>
      </div>
    </div>
  )
}
