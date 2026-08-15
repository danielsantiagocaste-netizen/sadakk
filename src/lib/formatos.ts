const formateadorCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

/** Formatea un número como pesos colombianos: 150000 -> "$150.000" */
export function formatoPesos(valor: number): string {
  return formateadorCOP.format(Math.round(valor))
}

/** Formatea una fecha ISO a "14 ago 2026" */
export function formatoFecha(fechaISO: string): string {
  return new Date(fechaISO).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Formatea fecha + hora: "14 ago 2026, 3:40 p.m." */
export function formatoFechaHora(fechaISO: string): string {
  return new Date(fechaISO).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
