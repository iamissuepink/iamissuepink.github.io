-- めろﾋﾟｮﾝ☆ step10（2026-11-17 組み合わせ層）
-- 保存BOXを 5個 → 20個 にして、名前を変えられるようにする。
-- Supabase の SQL Editor に全部貼って「Run」。何回実行しても大丈夫。
-- ※今までの決まり（5個まで）ゎ消さずに、20個までOKの決まりを「追加」するだけ。
--   （Supabase の決まりゎ「どれか1つに当てはまればOK」なので、追加すれば20個までしまえる）

-- 1) 20個までしまえる決まりを追加
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'hp_backups' and policyname = 'm10_backups_ins20') then
    create policy m10_backups_ins20 on public.hp_backups for insert to authenticated
      with check (user_id = auth.uid() and (select count(*) from public.hp_backups b where b.user_id = auth.uid()) < 20);
  end if;
end $$;

-- 2) 自分がしまったものの名前を変えられるように
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'hp_backups' and policyname = 'm10_backups_upd') then
    create policy m10_backups_upd on public.hp_backups for update to authenticated
      using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;
grant select, insert, update, delete on public.hp_backups to authenticated;

-- 3) 確認：hp_backups の決まりの一覧
--    もし「permissive」が RESTRICTIVE の行があったら、それが5個の制限をしてるかも → その行の名前を教えてね
select policyname, permissive, cmd from pg_policies where schemaname = 'public' and tablename = 'hp_backups' order by policyname;
-- トリガーで制限してないかの確認（何か出たら名前を教えてね）
select tgname from pg_trigger where tgrelid = 'public.hp_backups'::regclass and not tgisinternal;
