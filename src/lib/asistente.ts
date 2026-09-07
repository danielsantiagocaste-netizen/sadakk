import { supabase } from './supabase'
import { formatoPesos } from './formatos'
import { calcularRango, type PeriodoGanancias } from '../hooks/useGanancias'
import type { Perfume, Cliente, VentaDetalle } from '../types/database'

function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Busca el texto que sigue a alguno de los marcadores (ej. " de ", " del "). */
function extraerTras(texto: string, marcadores: string[]): string | null {
  for (const m of marcadores) {
    const idx = texto.indexOf(m)
    if (idx !== -1) {
      const resto = texto.slice(idx + m.length).trim()
      if (resto) return resto
    }
  }
  return null
}

function detectarPeriodo(texto: string): PeriodoGanancias {
  if (texto.includes('hoy')) return 'hoy'
  if (texto.includes('semana')) return 'semana'
  if (texto.includes('mes')) return 'mes'
  return 'todo'
}

const ETIQUETAS_PERIODO: Record<PeriodoGanancias, string> = {
  todo: 'en todo el histórico',
  hoy: 'hoy',
  semana: 'esta semana',
  mes: 'este mes',
  personalizado: 'en ese periodo',
}

async function buscarPerfumes(termino: string): Promise<Perfume[]> {
  const t = termino.replace(/[%,]/g, '')
  const { data } = await supabase
    .from('perfumes')
    .select('*')
    .eq('activo', true)
    .or(`nombre.ilike.%${t}%,marca.ilike.%${t}%`)
  return (data ?? []) as unknown as Perfume[]
}

async function buscarClientes(termino: string): Promise<Cliente[]> {
  const t = termino.replace(/[%,]/g, '')
  const { data } = await supabase.from('clientes').select('*').ilike('nombre', `%${t}%`)
  return (data ?? []) as unknown as Cliente[]
}

async function ventasDelPeriodo(periodo: PeriodoGanancias): Promise<VentaDetalle[]> {
  const rango = calcularRango(periodo, { desde: '', hasta: '' })
  let query = supabase.from('vista_ventas_detalle').select('*')
  if (rango) query = query.gte('fecha', rango.desde).lte('fecha', rango.hasta + 'T23:59:59')
  const { data } = await query
  return (data ?? []) as unknown as VentaDetalle[]
}

const MENSAJE_AYUDA =
  'No entendí bien la pregunta. Puedes intentar algo como:\n' +
  '• "precio de Sauvage"\n' +
  '• "stock de 212 VIP"\n' +
  '• "ventas de este mes"\n' +
  '• "ganancia de hoy"\n' +
  '• "cuánto debe Juan Pérez"\n' +
  '• "perfumes con poco stock"\n' +
  '• "cuál es el perfume más vendido"'

export async function responderPregunta(preguntaOriginal: string): Promise<string> {
  const texto = normalizar(preguntaOriginal)

  // 1. Stock / unidades de un perfume
  if (/(stock|unidades|cuantas?\s.*(hay|tengo)|hay de)/.test(texto)) {
    const termino = extraerTras(texto, [' de ', ' del '])
    if (termino) {
      const resultados = await buscarPerfumes(termino)
      if (resultados.length === 0) return `No encontré ningún perfume que coincida con "${termino}".`
      if (resultados.length === 1) {
        const p = resultados[0]
        return `${p.nombre} (${p.marca}) tiene ${p.stock} unidades en inventario.`
      }
      return (
        `Encontré varios perfumes que coinciden con "${termino}":\n` +
        resultados.map((p) => `• ${p.nombre} (${p.marca}) — ${p.stock} unidades`).join('\n')
      )
    }
  }

  // 2. Precio / costo / ganancia de un perfume puntual
  if (/(precio|costo|cuesta|vale)/.test(texto)) {
    const termino = extraerTras(texto, [' de ', ' del '])
    if (termino) {
      const resultados = await buscarPerfumes(termino)
      if (resultados.length === 0) return `No encontré ningún perfume que coincida con "${termino}".`
      if (resultados.length === 1) {
        const p = resultados[0]
        const ganancia = p.precio_venta - p.costo
        return `${p.nombre} (${p.marca}): costo ${formatoPesos(p.costo)}, precio de venta ${formatoPesos(
          p.precio_venta
        )}, ganancia ${formatoPesos(ganancia)} por unidad. Stock: ${p.stock} unidades.`
      }
      return (
        `Encontré varios perfumes que coinciden con "${termino}":\n` +
        resultados.map((p) => `• ${p.nombre} (${p.marca}) — ${formatoPesos(p.precio_venta)}`).join('\n')
      )
    }
  }

  // 3. Deuda / saldo de un cliente puntual
  if (/(debe|deuda|me debe|le debo)/.test(texto)) {
    const termino = extraerTras(texto, [' de ', ' del ', 'debe ', 'deuda de '])
    if (termino) {
      const resultados = await buscarClientes(termino)
      if (resultados.length >= 1) {
        const cliente = resultados[0]
        const { data } = await supabase.from('vista_ventas_detalle').select('*').eq('cliente_id', cliente.id)
        const ventas = (data ?? []) as unknown as VentaDetalle[]
        const saldo = ventas.reduce((acc, v) => acc + v.saldo, 0)
        if (saldo === 0) return `${cliente.nombre} no tiene saldo pendiente — está al día.`
        return `${cliente.nombre} debe ${formatoPesos(saldo)} en total.`
      }
      return `No encontré ningún cliente que coincida con "${termino}".`
    }
  }

  // 4. Perfumes con poco stock
  if (/(poco stock|pocas unidades|stock bajo|bajo stock|faltan? unidades)/.test(texto)) {
    const { data } = await supabase.from('perfumes').select('*').eq('activo', true)
    const perfumes = (data ?? []) as unknown as Perfume[]
    const bajos = perfumes.filter((p) => p.stock <= p.stock_minimo)
    if (bajos.length === 0) return 'Ningún perfume tiene stock bajo en este momento.'
    return (
      'Perfumes con poco stock:\n' +
      bajos.map((p) => `• ${p.nombre} (${p.marca}) — ${p.stock} unidades`).join('\n')
    )
  }

  // 5. Perfume más vendido
  if (/(mas vendido|top ventas|perfume top)/.test(texto)) {
    const ventas = await ventasDelPeriodo('todo')
    if (ventas.length === 0) return 'Todavía no hay ventas registradas.'
    const cantidades = new Map<string, number>()
    for (const v of ventas) {
      cantidades.set(v.perfume_nombre, (cantidades.get(v.perfume_nombre) ?? 0) + v.cantidad)
    }
    const ordenado = Array.from(cantidades.entries()).sort((a, b) => b[1] - a[1])
    const [nombre, cantidad] = ordenado[0]
    return `El perfume más vendido es "${nombre}", con ${cantidad} unidades vendidas en total.`
  }

  // 6. Pendiente por cobrar general (sin cliente específico)
  if (/(pendiente por cobrar|cuanto me deben|deuda total|dinero pendiente)/.test(texto)) {
    const ventas = await ventasDelPeriodo('todo')
    const pendiente = ventas.reduce((acc, v) => acc + v.saldo, 0)
    return `Tienes ${formatoPesos(pendiente)} pendientes por cobrar en total.`
  }

  // 7. Resumen general de ventas/ganancias por periodo (catch-all)
  if (/(venta|ingreso|ganancia|cobrado|vendido)/.test(texto)) {
    const periodo = detectarPeriodo(texto)
    const ventas = await ventasDelPeriodo(periodo)
    const totalVendido = ventas.reduce((acc, v) => acc + v.precio_total, 0)
    const totalGanancia = ventas.reduce((acc, v) => acc + v.ganancia_total, 0)
    const totalCobrado = ventas.reduce((acc, v) => acc + v.total_abonado, 0)
    const totalPendiente = ventas.reduce((acc, v) => acc + v.saldo, 0)
    const etiqueta = ETIQUETAS_PERIODO[periodo]
    return `Resumen ${etiqueta}: ${ventas.length} ventas, total vendido ${formatoPesos(
      totalVendido
    )}, ganancia ${formatoPesos(totalGanancia)}, cobrado ${formatoPesos(totalCobrado)}, pendiente ${formatoPesos(
      totalPendiente
    )}.`
  }

  return MENSAJE_AYUDA
}
