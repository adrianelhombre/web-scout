-- Extensiones recomendadas
create extension if not exists "pgcrypto";

-- Tabla clubes
create table if not exists public.clubes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

-- Tabla jugadores
create table if not exists public.jugadores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ano_nacimiento integer not null,
  posicion text not null,
  pierna text not null,
  club_id uuid not null references public.clubes(id) on delete restrict,
  categoria text not null,
  nivel integer not null check (nivel between 1 and 5),
  potencial integer not null check (potencial between 1 and 5),
  estado text not null check (estado in ('observado', 'seguimiento', 'interesante', 'prioritario', 'descartado')),
  observaciones text,
  created_at timestamptz not null default now()
);

-- Tabla informes
create table if not exists public.informes (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid not null references public.jugadores(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete restrict,
  fecha date not null,
  partido text not null,
  comentario text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_jugadores_club on public.jugadores(club_id);
create index if not exists idx_jugadores_estado on public.jugadores(estado);
create index if not exists idx_informes_jugador_fecha on public.informes(jugador_id, fecha desc);

-- RLS
alter table public.clubes enable row level security;
alter table public.jugadores enable row level security;
alter table public.informes enable row level security;

-- Políticas básicas para usuarios autenticados
create policy "clubes_select_auth"
  on public.clubes for select
  to authenticated
  using (true);

create policy "clubes_insert_auth"
  on public.clubes for insert
  to authenticated
  with check (true);

create policy "jugadores_select_auth"
  on public.jugadores for select
  to authenticated
  using (true);

create policy "jugadores_insert_auth"
  on public.jugadores for insert
  to authenticated
  with check (true);

create policy "informes_select_auth"
  on public.informes for select
  to authenticated
  using (true);

create policy "informes_insert_auth"
  on public.informes for insert
  to authenticated
  with check (auth.uid() = usuario_id);
