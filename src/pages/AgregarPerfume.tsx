import { useNavigate } from 'react-router-dom'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { FormularioPerfume } from '../components/inventario/FormularioPerfume'
import { usePerfumes } from '../hooks/usePerfumes'

export function AgregarPerfume() {
  const { agregarPerfume } = usePerfumes()
  const navegar = useNavigate()

  return (
    <div>
      <EncabezadoAtras titulo="Agregar perfume" />
      <FormularioPerfume
        textoBoton="Agregar al inventario"
        onGuardar={async (datos) => {
          const resultado = await agregarPerfume(datos)
          if (!resultado.error) navegar('/inventario')
          return resultado
        }}
      />
    </div>
  )
}
