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

create table if not exists program_items (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null,
  time text not null default '',
  title text not null,
  description text,
  created_at timestamptz not null default now()
);
create table if not exists settings (key text primary key, value text not null);
alter table program_items enable row level security;
alter table settings enable row level security;

-- Optional sample program (the admin panel has a "Load sample program" button that does the same)
insert into program_items (sort_order, time, title, description)
select * from (values
  (1, '09:00', 'Guests arrive and are seated', 'Ushers will show you to your seats in the garden.'),
  (2, '10:00', 'Opening prayer and welcome', 'The families are welcomed and the day is opened in prayer.'),
  (3, '10:30', 'Arrival of the groom''s family', null),
  (4, '11:00', 'Introductions of the two families', null),
  (5, '11:30', 'Roora presentation', 'The roora is presented and received.'),
  (6, '13:00', 'Blessing and acceptance', null),
  (7, '13:30', 'Garden luncheon', 'Join us for lunch under the trees.'),
  (8, '15:00', 'Music and celebration', null),
  (9, '17:00', 'Closing and farewell', 'Thank you for celebrating with us.')
) as v(sort_order, time, title, description)
where not exists (select 1 from program_items);
