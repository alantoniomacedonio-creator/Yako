-- ========================================================
-- TOTAL GAME CATÁLOGO - SCRIPT SQL PARA SUPABASE
-- ========================================================
-- Instrucciones:
-- 1. Entra a tu proyecto en https://supabase.com
-- 2. Haz clic en "SQL Editor" en el menú de la izquierda.
-- 3. Pega todo este código y presiona "RUN" (ejecutar).
-- ========================================================

-- 1. Crear tabla de juegos
create table if not exists games (
  id text primary key,
  title text not null,
  platform text not null,
  genre text not null,
  condition text not null,
  price numeric not null default 5900,
  description text default '',
  image_url text default '',
  in_stock boolean default true,
  featured boolean default false,
  languages text default 'Español Latino, Inglés',
  release_year integer default 2013,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 2. Habilitar seguridad (RLS) pero permitir lectura y escritura pública para tu tienda
alter table games enable row level security;

-- Permitir a los visitantes ver el catálogo
create policy "Lectura pública de juegos"
on games for select
using (true);

-- Permitir agregar juegos
create policy "Insertar juegos"
on games for insert
with check (true);

-- Permitir editar cartas (fotos, precios, títulos)
create policy "Actualizar juegos"
on games for update
using (true);

-- Permitir borrar juegos
create policy "Eliminar juegos"
on games for delete
using (true);

-- 3. Habilitar Tiempo Real (Realtime)
-- Esto hace que cuando edites una carta, cambie automáticamente
-- en el celular de tus clientes en menos de 1 segundo.
alter publication supabase_realtime add table games;
