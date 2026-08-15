/** Calcula el precio de venta sugerido a partir del costo y el % de ganancia. */
export function calcularPrecioSugerido(costo: number, porcentajeGanancia: number): number {
  return Math.round(costo * (1 + porcentajeGanancia / 100))
}

/** Calcula la ganancia por unidad. */
export function calcularGanancia(costo: number, precioVenta: number): number {
  return precioVenta - costo
}

/** Calcula el % de ganancia real dado un costo y un precio de venta manual. */
export function calcularPorcentajeReal(costo: number, precioVenta: number): number {
  if (costo === 0) return 0
  return Math.round(((precioVenta - costo) / costo) * 100)
}

export function calcularSaldo(precioTotal: number, totalAbonado: number): number {
  return Math.max(0, precioTotal - totalAbonado)
}
