-- めろﾋﾟｮﾝ☆ step8（2026-11-17 監査対応）
-- Supabase の SQL Editor に全部貼って「Run」。何回実行しても大丈夫。
-- ※secret key / service_role は使わない。ここでは権限の設定だけをする。

-- 1) 「消す」が効かないことがある問題：自分のものを消せる権限をそろえる
do $$
declare r record;
begin
  for r in select * from (values
    ('photos',          'm8_photos_del',    'user_id = auth.uid()'),
    ('diaries',         'm8_diaries_del',   'user_id = auth.uid()'),
    ('hp_bbs',          'm8_hpbbs_del',     'owner = auth.uid() or user_id = auth.uid()'),
    ('questions',       'm8_questions_del', 'owner = auth.uid()'),
    ('materials',       'm8_materials_del', 'user_id = auth.uid()'),
    ('hp_backups',      'm8_backups_del',   'user_id = auth.uid()'),
    ('friend_requests', 'm8_fr_del',        'from_id = auth.uid() or to_id = auth.uid()'),
    ('bbs_posts',       'm8_bbs_del',       'user_id = auth.uid()')
  ) as t(tb, pol, cond)
  loop
    execute format('grant delete on public.%I to authenticated', r.tb);
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = r.tb and policyname = r.pol) then
      execute format('create policy %I on public.%I for delete to authenticated using (%s)', r.pol, r.tb, r.cond);
    end if;
  end loop;
end $$;

-- 2) 写真ファイル（Storage の hp ﾊﾞｹｯﾄ）も自分のﾌｫﾙﾀﾞのものは消せるように
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'm8_hp_del') then
    create policy m8_hp_del on storage.objects for delete to authenticated
      using (bucket_id = 'hp' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;

-- 3) 登録ﾌｫｰﾑ（ﾛｸﾞｲﾝ前）で めろID が使えるか確認できるように
do $$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and p.proname = 'hp_id_available'
  loop
    execute format('grant execute on function %s to anon', f.sig);
  end loop;
end $$;

-- 4) 確認：消す権限の一覧（photos などに DELETE か ALL の行があればOK）
select tablename, policyname, cmd
from pg_policies
where schemaname in ('public', 'storage') and cmd in ('DELETE', 'ALL')
order by tablename, policyname;

-- ※研究用メモ：登録時の「どこで知った？」と研究への同意は、ﾛｸﾞｲﾝ情報（auth.users の raw_user_meta_data）に入ってる。
--   例）select raw_user_meta_data->>'ref' as ref, raw_user_meta_data->>'research' as ok, count(*) from auth.users group by 1, 2;
