import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Shell } from './Shell'

export function RutaProtegida({ children }: { children: ReactNode }) {
  const { session, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-noir">
        <p className="text-ivory-dim text-sm">Cargando SADAK…</p>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return <Shell>{children}</Shell>
}
