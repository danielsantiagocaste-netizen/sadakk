import { useState } from 'react'
import { Search, Check, UserPlus } from 'lucide-react'
import { useClientes } from '../../hooks/useClientes'
import type { Cliente } from '../../types/database'

interface SelectorClienteProps {
  seleccionado: Cliente | null
  onSeleccionar: (cliente: Cliente) => void
}

export function SelectorCliente({ seleccionado, onSeleccionar }: SelectorClienteProps) {
  const { clientes, crearCliente } = useClientes()
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [creando, setCreando] = useState(false)
  const [telefonoNuevo, setTelefonoNuevo] = useState('')

  const filtrados = clientes.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  const hayCoincidenciaExacta = clientes.some((c) => c.nombre.toLowerCase() === busqueda.toLowerCase())

  async function manejarCrear() {
    if (!busqueda.trim()) return
    setCreando(true)
    const { cliente, error } = await crearCliente(busqueda.trim(), telefonoNuevo)
    setCreando(false)
    if (cliente && !error) {
      onSeleccionar(cliente)
      setAbierto(false)
      setBusqueda('')
      setTelefonoNuevo('')
    }
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-noir-3 px-4 py-3.5 text-left"
      >
        {seleccionado ? (
          <div>
            <p className="text-[15px] text-ivory">{seleccionado.nombre}</p>
            {seleccionado.telefono && <p className="text-xs text-ivory-dim">{seleccionado.telefono}</p>}
          </div>
        ) : (
          <span className="text-ivory-dim">Seleccionar cliente…</span>
        )}
        <Search size={17} className="text-ivory-dim" />
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-gold bg-noir-3 p-3">
      <div className="relative mb-2">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-dim" />
        <input
          autoFocus
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar o escribir nombre nuevo…"
          className="w-full rounded-lg border border-line bg-noir-2 py-2.5 pl-9 pr-3 text-sm text-ivory outline-none focus:border-gold"
        />
      </div>

      <div className="max-h-44 overflow-y-auto flex flex-col gap-1">
        {filtrados.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              onSeleccionar(c)
              setAbierto(false)
              setBusqueda('')
            }}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-noir-2"
          >
            <div>
              <p className="text-sm text-ivory">{c.nombre}</p>
              {c.telefono && <p className="text-xs text-ivory-dim">{c.telefono}</p>}
            </div>
            {seleccionado?.id === c.id && <Check size={16} className="text-gold" />}
          </button>
        ))}
      </div>

      {busqueda.trim() && !hayCoincidenciaExacta && (
        <div className="mt-2 border-t border-line pt-3">
          <p className="mb-2 text-xs text-ivory-dim">Cliente nuevo</p>
          <input
            value={telefonoNuevo}
            onChange={(e) => setTelefonoNuevo(e.target.value)}
            placeholder="Teléfono (opcional)"
            className="mb-2 w-full rounded-lg border border-line bg-noir-2 py-2.5 px-3 text-sm text-ivory outline-none focus:border-gold"
          />
          <button
            type="button"
            disabled={creando}
            onClick={manejarCrear}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-sm font-medium text-ivory disabled:opacity-50"
          >
            <UserPlus size={16} /> Crear "{busqueda.trim()}"
          </button>
        </div>
      )}
    </div>
  )
}
