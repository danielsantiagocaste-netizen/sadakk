import { NavLink } from 'react-router-dom'
import { LayoutGrid, Package, Plus, Receipt, Menu } from 'lucide-react'

const enlaces = [
  { to: '/', icono: LayoutGrid, etiqueta: 'Inicio', exacto: true },
  { to: '/inventario', icono: Package, etiqueta: 'Inventario' },
  { to: '/ventas/nueva', icono: Plus, etiqueta: 'Vender', destacado: true },
  { to: '/ventas', icono: Receipt, etiqueta: 'Ventas' },
  { to: '/mas', icono: Menu, etiqueta: 'Más' },
]

export function NavInferior() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-noir/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-between px-2 py-2">
        {enlaces.map(({ to, icono: Icono, etiqueta, exacto, destacado }) => (
          <NavLink
            key={to}
            to={to}
            end={exacto}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] transition ${
                destacado
                  ? 'text-ivory'
                  : isActive
                    ? 'text-gold'
                    : 'text-ivory-dim'
              }`
            }
          >
            {({ isActive }) =>
              destacado ? (
                <>
                  <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-gold shadow-lg shadow-gold/20">
                    <Icono size={22} strokeWidth={2.25} />
                  </span>
                  <span className="text-ivory-dim">{etiqueta}</span>
                </>
              ) : (
                <>
                  <Icono size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{etiqueta}</span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
