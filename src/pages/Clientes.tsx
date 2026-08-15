import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { useClientesConSaldo } from '../hooks/useClienteDetalle'
import { formatoPesos } from '../lib/formatos'

export function Clientes() {
  const { lista, cargando } = useClientesConSaldo()
  const [busqueda, setBusqueda] = useState('')

  const filtrados = lista.filter((r) => r.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div>
      <EncabezadoAtras titulo="Clientes" />
      <div className="p-5 flex flex-col gap-4">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cliente…"
            className="w-full rounded-xl border border-line bg-noir-2 py-3 pl-10 pr-4 text-[15px] text-ivory placeholder:text-ivory-dim/50 outline-none focus:border-gold"
          />
        </div>

        {cargando && <p className="text-sm text-ivory-dim px-1">Cargando clientes…</p>}

        {!cargando && filtrados.length === 0 && (
          <div className="rounded-2xl border border-line bg-noir-2 p-8 text-center">
            <p className="text-ivory-dim text-sm">
              {lista.length === 0 ? 'Aún no tienes clientes registrados.' : 'Sin resultados.'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtrados.map(({ cliente, totalComprado, saldoPendiente }) => (
            <Link
              key={cliente.id}
              to={`/clientes/${cliente.id}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-noir-2 p-4 active:bg-noir-3"
            >
              <div>
                <p className="text-[15px] text-ivory">{cliente.nombre}</p>
                <p className="text-xs text-ivory-dim">Total comprado: {formatoPesos(totalComprado)}</p>
              </div>
              {saldoPendiente > 0 ? (
                <span className="tabular rounded-full bg-wine-soft px-3 py-1 text-xs text-wine">
                  Debe {formatoPesos(saldoPendiente)}
                </span>
              ) : (
                <span className="rounded-full bg-sage-soft px-3 py-1 text-xs text-sage">Al día</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
