import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { EncabezadoAtras } from '../components/layout/EncabezadoAtras'
import { FormularioPerfume } from '../components/inventario/FormularioPerfume'
import { usePerfumes } from '../hooks/usePerfumes'
import type { Perfume } from '../types/database'

export function DetallePerfume() {
  const { id } = useParams<{ id: string }>()
  const { perfumes, cargando, actualizarPerfume, archivarPerfume } = usePerfumes()
  const [perfume, setPerfume] = useState<Perfume | undefined>()
  const navegar = useNavigate()

  useEffect(() => {
    setPerfume(perfumes.find((p) => p.id === id))
  }, [perfumes, id])

  async function manejarArchivar() {
    if (!id) return
    const confirmar = window.confirm(
      'Este perfume se ocultará del inventario, pero su historial de ventas se conserva. ¿Continuar?'
    )
    if (!confirmar) return
    const { error } = await archivarPerfume(id)
    if (!error) navegar('/inventario')
  }

  if (cargando) {
    return (
      <div>
        <EncabezadoAtras titulo="Perfume" />
        <p className="p-5 text-sm text-ivory-dim">Cargando…</p>
      </div>
    )
  }

  if (!perfume) {
    return (
      <div>
        <EncabezadoAtras titulo="Perfume" />
        <p className="p-5 text-sm text-ivory-dim">No se encontró este perfume.</p>
      </div>
    )
  }

  return (
    <div>
      <EncabezadoAtras titulo={perfume.nombre} />
      <FormularioPerfume
        perfumeInicial={perfume}
        textoBoton="Guardar cambios"
        onGuardar={(datos) => actualizarPerfume(perfume.id, datos)}
      />
      <div className="px-5 pb-8">
        <button
          onClick={manejarArchivar}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-wine/50 py-3.5 text-sm text-wine"
        >
          <Trash2 size={16} /> Quitar del inventario
        </button>
      </div>
    </div>
  )
}
