import type { ReactNode } from 'react'
import { NavInferior } from './NavInferior'

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-noir">
      <main className="mx-auto max-w-md pb-28">{children}</main>
      <NavInferior />
    </div>
  )
}
