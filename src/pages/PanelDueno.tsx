import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { Tarjeta } from '../components/ui/Tarjeta'

export function PanelDueno() {
  return (
    <div>
      <EncabezadoAtras titulo="Panel del dueño" />
      <div className="p-5">
        <Tarjeta>
          <p className="text-ivory-dim text-sm">Administración y estadísticas — esta sección se construye en la Etapa 5.</p>
        </Tarjeta>
      </div>
    </div>
  )
}
