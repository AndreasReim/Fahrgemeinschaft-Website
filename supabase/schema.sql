-- In Supabase: SQL Editor → New query → Run

-- Profile pro Auth-User
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- Fahrgemeinschaften / Mitfahrgelegenheiten
create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles (id) on delete cascade,
  origin text not null,
  destination text not null,
  departure_at timestamptz not null,
  seats_available integer not null check (seats_available > 0 and seats_available <= 8),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists rides_departure_at_idx on public.rides (departure_at);
create index if not exists rides_origin_idx on public.rides (origin);
create index if not exists rides_destination_idx on public.rides (destination);

alter table public.profiles enable row level security;
alter table public.rides enable row level security;

-- Profile: lesen für eingeloggte Nutzer, eigenes Profil bearbeiten
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Rides: lesen für eingeloggte, anlegen nur als Fahrer, ändern/löschen nur eigene
create policy "rides_select_authenticated"
  on public.rides for select
  to authenticated
  using (true);

create policy "rides_insert_own"
  on public.rides for insert
  to authenticated
  with check (auth.uid() = driver_id);

create policy "rides_update_own"
  on public.rides for update
  to authenticated
  using (auth.uid() = driver_id);

create policy "rides_delete_own"
  on public.rides for delete
  to authenticated
  using (auth.uid() = driver_id);

-- Profil automatisch bei Registrierung (Display-Name aus Metadaten)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
