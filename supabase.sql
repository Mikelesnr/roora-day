create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  family_name text,
  email text,
  phone text,
  max_party int not null default 1,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  attending int not null default 0,
  note text,
  responded_at timestamptz,
  emailed_at timestamptz,
  whatsapp_at timestamptz,
  created_at timestamptz not null default now()
);
alter table guests enable row level security;
