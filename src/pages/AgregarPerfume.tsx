import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LibraryBig } from 'lucide-react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { FormularioPerfume } from '../components/inventario/FormularioPerfume'
import { usePerfumes } from '../hooks/usePerfumes'

interface EstadoNavegacion {
  nombre?: string
  marca?: string
}

export function AgregarPerfume() {
  const { agregarPerfume } = usePerfumes()
  const navegar = useNavigate()
  const location = useLocation()
  const prellenado = (location.state as EstadoNavegacion) ?? {}

  return (
    <div>
      <EncabezadoAtras titulo="Agregar perfume" />

      {!prellenado.nombre && (
        <div className="px-5 pt-5">
          <Link
            to="/inventario/catalogo"
            className="flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <LibraryBig size={18} />
            </span>
            <div>
              <p className="text-sm text-ivory">Elegir del catálogo</p>
              <p className="text-xs text-ivory-dim">Busca por marca y evita escribir todo a mano</p>
            </div>
          </Link>
        </div>
      )}

      <FormularioPerfume
        textoBoton="Agregar al inventario"
        nombreInicial={prellenado.nombre}
        marcaInicial={prellenado.marca}
        onGuardar={async (datos) => {
          const resultado = await agregarPerfume(datos)
          if (!resultado.error) navegar('/inventario')
          return resultado
        }}
      />
    </div>
  )
}
