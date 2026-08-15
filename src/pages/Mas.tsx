import { Link } from 'react-router-dom'
import { Users, TrendingUp, ShieldCheck, LogOut, ChevronRight } from 'lucide-react'
import { Encabezado } from '../components/layout/Encabezado'
import { useAuth } from '../hooks/useAuth'

const enlaces = [
  { to: '/clientes', etiqueta: 'Clientes', icono: Users, descripcion: 'Historial y saldos por cliente' },
  { to: '/ganancias', etiqueta: 'Ganancias', icono: TrendingUp, descripcion: 'Ventas, costos y ganancia del negocio' },
  { to: '/panel-dueno', etiqueta: 'Panel del dueño', icono: ShieldCheck, descripcion: 'Estadísticas y administración' },
]

export function Mas() {
  const { cerrarSesion } = useAuth()

  return (
    <div>
      <Encabezado titulo="Más" subtitulo="Ganancias, clientes y ajustes" />
      <div className="p-5 flex flex-col gap-3">
        {enlaces.map(({ to, etiqueta, icono: Icono, descripcion }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-2xl border border-line bg-noir-2 p-4 active:bg-noir-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-noir-3 text-gold">
              <Icono size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-ivory">{etiqueta}</p>
              <p className="text-xs text-ivory-dim">{descripcion}</p>
            </div>
            <ChevronRight size={18} className="text-ivory-dim" />
          </Link>
        ))}

        <button
          onClick={() => cerrarSesion()}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-wine/40 py-3.5 text-sm text-wine"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}
