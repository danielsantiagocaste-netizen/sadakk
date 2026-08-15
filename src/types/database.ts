export type MetodoPago = 'efectivo' | 'transferencia'
export type EstadoVenta = 'pendiente' | 'completo'

export interface Perfume {
  id: string
  nombre: string
  marca: string
  costo: number
  porcentaje_ganancia: number
  precio_venta: number
  precio_manual: boolean
  stock: number
  stock_minimo: number
  imagen_url: string | null
  notas: string | null
  activo: boolean
  creado_en: string
  actualizado_en: string
}

export interface Cliente {
  id: string
  nombre: string
  telefono: string | null
  creado_en: string
}

export interface Venta {
  id: string
  cliente_id: string
  perfume_id: string
  cantidad: number
  costo_unitario: number
  precio_unitario: number
  precio_total: number
  ganancia_total: number
  metodo_pago: MetodoPago
  estado: EstadoVenta
  notas: string | null
  fecha: string
  creado_por: string | null
  creado_en: string
}

export interface VentaDetalle extends Venta {
  cliente_nombre: string
  cliente_telefono: string | null
  perfume_nombre: string
  perfume_marca: string
  total_abonado: number
  saldo: number
}

export interface Abono {
  id: string
  venta_id: string
  valor: number
  metodo_pago: MetodoPago
  fecha: string
  nota: string | null
  creado_por: string | null
  creado_en: string
}

export interface Usuario {
  id: string
  nombre: string
  rol: 'dueño' | 'vendedor'
  creado_en: string
}

// Tipo mínimo requerido por supabase-js para tipar el cliente.
// Se puede reemplazar luego por el tipo generado automáticamente con
// `supabase gen types typescript` para tener 100% de precisión.
export type Database = {
  public: {
    Tables: {
      perfumes: { Row: Perfume; Insert: Partial<Perfume>; Update: Partial<Perfume> }
      clientes: { Row: Cliente; Insert: Partial<Cliente>; Update: Partial<Cliente> }
      ventas: { Row: Venta; Insert: Partial<Venta>; Update: Partial<Venta> }
      abonos: { Row: Abono; Insert: Partial<Abono>; Update: Partial<Abono> }
      usuarios: { Row: Usuario; Insert: Partial<Usuario>; Update: Partial<Usuario> }
    }
    Views: {
      vista_ventas_detalle: { Row: VentaDetalle }
    }
  }
}
