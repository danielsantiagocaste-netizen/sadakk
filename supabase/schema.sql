-- ============================================================
-- SADAK — Esquema de base de datos
-- Pega este archivo completo en: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. USUARIOS (perfil extendido sobre auth.users)
-- ------------------------------------------------------------
create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null default 'dueño' check (rol in ('dueño', 'vendedor')),
  creado_en timestamptz not null default now()
);

-- Crea automáticamente un perfil en "usuarios" cuando alguien se registra en Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, nombre, rol)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', new.email), 'dueño');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 2. PERFUMES
-- ------------------------------------------------------------
create table public.perfumes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  marca text not null,
  costo numeric(12,2) not null check (costo >= 0),
  porcentaje_ganancia numeric(5,2) not null default 50,
  precio_venta numeric(12,2) not null check (precio_venta >= 0),
  precio_manual boolean not null default false,
  stock integer not null default 0 check (stock >= 0),
  stock_minimo integer not null default 3,
  imagen_url text,
  notas text,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- función auxiliar para mantener "actualizado_en" al día
create or replace function moddatetime_actualizado_en()
returns trigger as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$ language plpgsql;

create trigger set_actualizado_en_perfumes
  before update on public.perfumes
  for each row execute procedure moddatetime_actualizado_en();

-- ------------------------------------------------------------
-- 3. CLIENTES
-- ------------------------------------------------------------
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  creado_en timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. VENTAS
-- ------------------------------------------------------------
create table public.ventas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete restrict,
  perfume_id uuid not null references public.perfumes(id) on delete restrict,
  cantidad integer not null check (cantidad > 0),
  costo_unitario numeric(12,2) not null,      -- snapshot del costo al momento de vender
  precio_unitario numeric(12,2) not null,     -- snapshot del precio al momento de vender
  precio_total numeric(12,2) not null,        -- precio_unitario * cantidad
  ganancia_total numeric(12,2) not null,      -- (precio_unitario - costo_unitario) * cantidad
  metodo_pago text not null check (metodo_pago in ('efectivo', 'transferencia')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'completo')),
  notas text,
  fecha timestamptz not null default now(),
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create index idx_ventas_cliente on public.ventas(cliente_id);
create index idx_ventas_perfume on public.ventas(perfume_id);
create index idx_ventas_fecha on public.ventas(fecha);
create index idx_ventas_estado on public.ventas(estado);

-- ------------------------------------------------------------
-- 5. ABONOS
-- ------------------------------------------------------------
create table public.abonos (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references public.ventas(id) on delete cascade,
  valor numeric(12,2) not null check (valor > 0),
  metodo_pago text not null check (metodo_pago in ('efectivo', 'transferencia')),
  fecha timestamptz not null default now(),
  nota text,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create index idx_abonos_venta on public.abonos(venta_id);

-- ============================================================
-- LÓGICA DE NEGOCIO (triggers) — la fuente de verdad vive en la BD,
-- no en el frontend, para que nunca se pueda desincronizar.
-- ============================================================

-- ------------------------------------------------------------
-- A) Al crear una venta: validar y descontar stock
-- ------------------------------------------------------------
create or replace function public.procesar_nueva_venta()
returns trigger as $$
declare
  stock_actual integer;
begin
  select stock into stock_actual from public.perfumes where id = new.perfume_id for update;

  if stock_actual is null then
    raise exception 'El perfume no existe';
  end if;

  if stock_actual < new.cantidad then
    raise exception 'Stock insuficiente: solo hay % unidades disponibles', stock_actual;
  end if;

  update public.perfumes
    set stock = stock - new.cantidad
    where id = new.perfume_id;

  -- Recalcular total y ganancia por seguridad, sin confiar solo en el frontend
  new.precio_total := new.precio_unitario * new.cantidad;
  new.ganancia_total := (new.precio_unitario - new.costo_unitario) * new.cantidad;
  new.estado := 'pendiente'; -- se recalcula tras insertar el abono inicial, si lo hay

  return new;
end;
$$ language plpgsql;

create trigger trg_nueva_venta
  before insert on public.ventas
  for each row execute procedure public.procesar_nueva_venta();

-- Si se elimina una venta, devolver el stock (por si se necesita corregir un error)
create or replace function public.revertir_venta_eliminada()
returns trigger as $$
begin
  update public.perfumes
    set stock = stock + old.cantidad
    where id = old.perfume_id;
  return old;
end;
$$ language plpgsql;

create trigger trg_venta_eliminada
  before delete on public.ventas
  for each row execute procedure public.revertir_venta_eliminada();

-- ------------------------------------------------------------
-- B) Al registrar un abono: validar que no supere el saldo,
--    y recalcular el estado de la venta automáticamente
-- ------------------------------------------------------------
create or replace function public.procesar_nuevo_abono()
returns trigger as $$
declare
  total_venta numeric(12,2);
  total_abonado numeric(12,2);
  saldo_restante numeric(12,2);
begin
  select precio_total into total_venta from public.ventas where id = new.venta_id for update;

  if total_venta is null then
    raise exception 'La venta no existe';
  end if;

  select coalesce(sum(valor), 0) into total_abonado
    from public.abonos where venta_id = new.venta_id;

  saldo_restante := total_venta - total_abonado;

  if new.valor > saldo_restante then
    raise exception 'El abono ($%) supera el saldo pendiente ($%)', new.valor, saldo_restante;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_nuevo_abono
  before insert on public.abonos
  for each row execute procedure public.procesar_nuevo_abono();

-- Después de insertar/eliminar un abono, recalcular el estado de la venta
create or replace function public.recalcular_estado_venta()
returns trigger as $$
declare
  v_venta_id uuid;
  total_venta numeric(12,2);
  total_abonado numeric(12,2);
begin
  v_venta_id := coalesce(new.venta_id, old.venta_id);

  select precio_total into total_venta from public.ventas where id = v_venta_id;
  select coalesce(sum(valor), 0) into total_abonado
    from public.abonos where venta_id = v_venta_id;

  update public.ventas
    set estado = case when total_abonado >= total_venta then 'completo' else 'pendiente' end
    where id = v_venta_id;

  return null;
end;
$$ language plpgsql;

create trigger trg_recalcular_estado_insert
  after insert on public.abonos
  for each row execute procedure public.recalcular_estado_venta();

create trigger trg_recalcular_estado_delete
  after delete on public.abonos
  for each row execute procedure public.recalcular_estado_venta();

-- ------------------------------------------------------------
-- C) Cálculo automático de precio_venta en perfumes (si no es manual)
-- ------------------------------------------------------------
create or replace function public.calcular_precio_perfume()
returns trigger as $$
begin
  if not new.precio_manual then
    new.precio_venta := round(new.costo * (1 + new.porcentaje_ganancia / 100.0), 2);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_calcular_precio_perfume
  before insert or update on public.perfumes
  for each row execute procedure public.calcular_precio_perfume();

-- ============================================================
-- VISTAS ÚTILES (para el dashboard y saldo por venta)
-- ============================================================

create view public.vista_ventas_detalle as
select
  v.*,
  c.nombre as cliente_nombre,
  c.telefono as cliente_telefono,
  p.nombre as perfume_nombre,
  p.marca as perfume_marca,
  coalesce((select sum(a.valor) from public.abonos a where a.venta_id = v.id), 0) as total_abonado,
  v.precio_total - coalesce((select sum(a.valor) from public.abonos a where a.venta_id = v.id), 0) as saldo
from public.ventas v
join public.clientes c on c.id = v.cliente_id
join public.perfumes p on p.id = v.perfume_id;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Regla: solo usuarios autenticados pueden leer/escribir.
-- ============================================================

alter table public.usuarios enable row level security;
alter table public.perfumes enable row level security;
alter table public.clientes enable row level security;
alter table public.ventas enable row level security;
alter table public.abonos enable row level security;

-- usuarios: cada quien ve/edita su propio perfil
create policy "usuarios_select_propio" on public.usuarios
  for select using (auth.uid() = id);
create policy "usuarios_update_propio" on public.usuarios
  for update using (auth.uid() = id);

-- perfumes: cualquier usuario autenticado puede leer y escribir
create policy "perfumes_select" on public.perfumes
  for select using (auth.role() = 'authenticated');
create policy "perfumes_insert" on public.perfumes
  for insert with check (auth.role() = 'authenticated');
create policy "perfumes_update" on public.perfumes
  for update using (auth.role() = 'authenticated');
create policy "perfumes_delete" on public.perfumes
  for delete using (auth.role() = 'authenticated');

-- clientes
create policy "clientes_select" on public.clientes
  for select using (auth.role() = 'authenticated');
create policy "clientes_insert" on public.clientes
  for insert with check (auth.role() = 'authenticated');
create policy "clientes_update" on public.clientes
  for update using (auth.role() = 'authenticated');

-- ventas
create policy "ventas_select" on public.ventas
  for select using (auth.role() = 'authenticated');
create policy "ventas_insert" on public.ventas
  for insert with check (auth.role() = 'authenticated');
create policy "ventas_update" on public.ventas
  for update using (auth.role() = 'authenticated');
create policy "ventas_delete" on public.ventas
  for delete using (auth.role() = 'authenticated');

-- abonos
create policy "abonos_select" on public.abonos
  for select using (auth.role() = 'authenticated');
create policy "abonos_insert" on public.abonos
  for insert with check (auth.role() = 'authenticated');
create policy "abonos_delete" on public.abonos
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
