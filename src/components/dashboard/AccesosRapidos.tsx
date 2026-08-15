import { Link } from 'react-router-dom'
import { Plus, HandCoins, PackagePlus, Package, Receipt } from 'lucide-react'

const accesos = [
  { to: '/ventas/nueva', etiqueta: 'Nueva venta', icono: Plus },
  { to: '/ventas', etiqueta: 'Registrar abono', icono: HandCoins },
  { to: '/inventario/nuevo', etiqueta: 'Agregar perfume', icono: PackagePlus },
  { to: '/inventario', etiqueta: 'Ver inventario', icono: Package },
  { to: '/ventas', etiqueta: 'Ver ventas', icono: Receipt },
]

export function AccesosRapidos() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
      {accesos.map(({ to, etiqueta, icono: Icono }) => (
        <Link
          key={etiqueta}
          to={to}
          className="flex shrink-0 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-noir-2 py-4 active:bg-noir-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Icono size={18} />
          </span>
          <span className="text-center text-[11px] leading-tight text-ivory-dim">{etiqueta}</span>
        </Link>
      ))}
    </div>
  )
}
