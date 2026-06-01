-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Create subjects table
create table if not exists subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create meetings table
create table if not exists meetings (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id) on delete cascade not null,
  title text not null,
  meeting_number integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create materials table
create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid references meetings(id) on delete cascade not null,
  title text not null,
  description text,
  drive_url text not null,
  file_type text default 'pdf' not null,
  thumbnail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for all tables
alter table subjects enable row level security;
alter table meetings enable row level security;
alter table materials enable row level security;

-- Policies for subjects
create policy "Allow public read access to subjects" 
  on subjects for select 
  using (true);

create policy "Allow all actions for authenticated service role / admin" 
  on subjects for all 
  using (auth.role() = 'authenticated' or auth.role() = 'service_role')
  with check (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Policies for meetings
create policy "Allow public read access to meetings" 
  on meetings for select 
  using (true);

create policy "Allow all actions for authenticated service role / admin" 
  on meetings for all 
  using (auth.role() = 'authenticated' or auth.role() = 'service_role')
  with check (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Policies for materials
create policy "Allow public read access to materials" 
  on materials for select 
  using (true);

create policy "Allow all actions for authenticated service role / admin" 
  on materials for all 
  using (auth.role() = 'authenticated' or auth.role() = 'service_role')
  with check (auth.role() = 'authenticated' or auth.role() = 'service_role');
