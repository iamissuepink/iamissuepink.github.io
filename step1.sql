-- ===== ステップ1：ホムペID・生年月・ホムペ本体 =====

-- ホムペID（半角英小文字・数字・_ の3〜16文字、あとから変更不可）
alter table profiles add column hp_id text unique check (hp_id ~ '^[a-z0-9_]{3,16}$');

-- ニックネームとひとことだけ自分で書き換えOK（IDは書き換え不可）
revoke update on profiles from authenticated, anon;
grant update (nickname, bio) on profiles to authenticated;

-- 本人しか見れない情報（生年月・保護者）
create table private_info (
  id uuid primary key references profiles(id) on delete cascade,
  birth_ym date not null,
  guardian_email text,
  needs_guardian boolean not null default false,
  guardian_approved boolean not null default false,
  created_at timestamptz default now()
);
alter table private_info enable row level security;
create policy "自分の情報だけ見れる" on private_info for select using (auth.uid() = id);

-- 年齢（生まれ月の最終日で計算＝いちばん若く見積もる）
create function public.age_of(b date) returns int language sql stable as $$
  select extract(year from age(current_date, (b + interval '1 month' - interval '1 day')::date))::int
$$;

-- IDが使えるか
create function public.hp_id_available(p text) returns boolean
language sql stable security definer set search_path = '' as $$
  select p ~ '^[a-z0-9_]{3,16}$'
     and p not in ('admin','melopyon','official','support','info','root','system','unei')
     and not exists (select 1 from public.profiles where hp_id = p)
$$;

-- はじめの設定（1回だけ）
create function public.setup_account(p_hp_id text, p_birth text, p_guardian text)
returns void language plpgsql security definer set search_path = '' as $$
declare b date; a int;
begin
  if auth.uid() is null then raise exception 'not_logged_in'; end if;
  if exists (select 1 from public.private_info where id = auth.uid()) then raise exception 'already_set'; end if;
  if not public.hp_id_available(p_hp_id) then raise exception 'id_taken'; end if;
  b := to_date(p_birth || '-01', 'YYYY-MM-DD');
  a := public.age_of(b);
  if a < 6 or a > 120 then raise exception 'bad_birth'; end if;
  if a <= 12 and coalesce(p_guardian, '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'need_guardian'; end if;
  update public.profiles set hp_id = p_hp_id where id = auth.uid();
  insert into public.private_info (id, birth_ym, guardian_email, needs_guardian)
    values (auth.uid(), b, nullif(p_guardian, ''), a <= 12);
end $$;

-- 使える状態か（設定済み＆保護者承認が必要なら承認済み）
create function public.can_use() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.private_info
    where id = auth.uid() and (not needs_guardian or guardian_approved))
$$;

-- ホムペ本体
create table homepages (
  user_id uuid primary key default auth.uid() references profiles(id) on delete cascade,
  data jsonb not null default '{}',
  visibility text not null default 'members' check (visibility in ('public','members','private')),
  counter int not null default 0,
  updated_at timestamptz default now()
);
alter table homepages enable row level security;
create policy "公開範囲に応じて見れる" on homepages for select using (
  visibility = 'public' or (visibility = 'members' and auth.uid() is not null) or auth.uid() = user_id);
create policy "自分のホムペを作れる" on homepages for insert to authenticated
  with check (auth.uid() = user_id and public.can_use());
create policy "自分のホムペを編集できる" on homepages for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id and public.can_use());
revoke insert, update on homepages from authenticated, anon;
grant insert (user_id, data, visibility, updated_at) on homepages to authenticated;
grant update (user_id, data, visibility, updated_at) on homepages to authenticated;

-- カウンター（見に来たら+1）
create function public.hp_visit(p_hp_id text) returns int
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  update public.homepages h set counter = h.counter + 1
    from public.profiles p where p.id = h.user_id and p.hp_id = p_hp_id
    returning h.counter into n;
  return n;
end $$;

-- 掲示板も「はじめの設定」が済んだ人だけ書き込めるように
drop policy "ログインした人だけ書き込める" on bbs_posts;
create policy "設定が済んだ人だけ書き込める" on bbs_posts for insert to authenticated
  with check (auth.uid() = user_id and public.can_use());
