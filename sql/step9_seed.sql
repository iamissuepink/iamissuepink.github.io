-- めろﾋﾟｮﾝ☆ step9：はじめのｺﾝﾃﾝﾂ（運営のﾎﾑﾍﾟ・日記・BBS）
-- 使い方：
--  1) 運営用のアカウントを、ふつうの登録ﾌｫｰﾑから作って「はじめの設定」まで終わらせる（あやね個人とゎ別のﾒｱﾄﾞがおすすめ）
--  2) 下の 'meropyon_unei'（2か所：hid の行と、いちばん下の確認の行）を、そのアカウントのめろIDに書きかえる
--  3) SQL Editor に全部貼って Run。何回実行しても、日記やBBSゎ2重にならないょ
-- ※ﾎﾑﾍﾟの中身ゎ上書きされるので、運営アカウント以外のめろIDを入れないでね

do $$
declare
  hid text := 'meropyon_unei';   -- ←ここを運営アカウントのめろIDに
  uid uuid;
begin
  select id into uid from public.profiles where hp_id = hid;
  if uid is null then raise exception 'めろID % のアカウントが見つからないょ（はじめの設定まで終わってる？）', hid; end if;

  update public.profiles set nickname = 'めろﾋﾟｮﾝ☆運営' where id = uid;
  insert into public.homepages (user_id, data, visibility, updated_at)
  values (uid, '{"tpl": "garake", "theme": "pink", "colors": {}, "title": "☆★めろﾋﾟｮﾝ☆運営のﾎﾑﾍﾟ★☆", "sub": "[c=#ff3d9a]ﾎﾑﾍﾟ作りの見本&おしらせ置き場[/c]", "marquee": "ようこそ(*´∀`*)ﾉﾞ めろﾋﾟｮﾝ☆ゎみんなのﾎﾑﾍﾟでできてるょ☆ 足あと・拍手・BBS大歓迎♪", "mood": "(*´∀`*)", "msg": "ﾖｳｺｿ(*´∀`*)ﾉ\n[big]めろﾋﾟｮﾝ☆[/big]\n[big][c=#ff3d9a]運営のﾎﾑﾍﾟ[/c][/big]へ\n\nここゎﾎﾑﾍﾟ作りの[rb]見本[/rb]にもなってるょ♪\nﾏﾈしたいところがあったら\nどんどんﾏﾈしてね[s=m/heart_beat.gif]\n\nｷﾘ番ふんだら\n[big][blink]ｷﾘ番ﾍﾟｰｼﾞ[/blink][/big]で報告してね!!\n\n↓ﾒﾆｭｰゎこちら↓", "showCounter": true, "kiri": "100,500,777,1000,1111,2000,3333,5000,7777,10000", "thanks": "拍手ありがと(*´∀`*)ﾉ\nすっごくうれしい!!\nまた遊びに来てね♪", "showClaps": true, "song": "", "icon": "", "iconPath": "", "tags": ["ﾎﾑﾍﾟ文化", "平成・Y2K", "ﾄﾞｯﾄ絵", "素材配布", "雑談"], "intro": "☆★自己紹介★☆\n呼んでほしい名前：めろﾋﾟｮﾝ☆運営\nすきなこと：ｷﾗｷﾗしたﾎﾑﾍﾟを見ること、ﾄﾞｯﾄ絵の素材づくり\n最近ﾊﾏってること：みんなのﾎﾑﾍﾟめぐり\nﾎﾑﾍﾟを作ったきっかけ：平成のｹｰﾀｲﾎﾑﾍﾟみたいに、自分だけの場所を作れるｻｲﾄがほしかったから\nひとこと：わからないことゎ[c=#ff3d9a]質問箱[/c]か[c=#ff3d9a]お問い合わせ[/c]からどうぞ♪", "qa": [["名前", "めろﾋﾟｮﾝ☆運営"], ["担当", "ｻｲﾄづくり・素材づくり・見回り"], ["すきな色", "ﾋﾟﾝｸ×黒"], ["すきな素材", "ｷﾗｷﾗとﾊｰﾄ"], ["口ぐせ", "ﾏﾀｰﾘいこ〜"], ["ひとこと", "ﾎﾑﾍﾟできたらBBSで教えてね♪"]], "real": [{"t": "運営のﾎﾑﾍﾟできた[s=m/kira_twinkle.gif] 見本にしてね♪", "at": "2026-11-17T09:00:00+09:00"}], "menu": [{"k": "prof", "l": "♡ﾌﾟﾛﾌ♡", "on": true}, {"k": "intro", "l": "♡自己紹介♡", "on": true}, {"k": "pguide", "l": "★ﾎﾑﾍﾟの作り方★", "on": true}, {"k": "pkiri", "l": "☆ｷﾘ番報告☆", "on": true}, {"k": "real", "l": "♡ﾘｱﾙ♡", "on": true}, {"k": "diary", "l": "♡日記♡", "on": true}, {"k": "photo", "l": "♡写真♡", "on": false}, {"k": "bbs", "l": "♡BBS♡", "on": true}, {"k": "ask", "l": "♡質問箱♡", "on": true}, {"k": "link", "l": "♡ﾘﾝｸ♡", "on": true}], "pages": {"pguide": {"b": "[center][big]★ﾎﾑﾍﾟの作り方★[/big][/center]\n\n[c=#ff3d9a]1.[/c] ﾏｲﾍﾟｰｼﾞの「ﾎﾑﾍﾟを編集する」を押す\n[c=#ff3d9a]2.[/c] 「新しく作る」でﾃﾝﾌﾟﾚを選ぶ\n[c=#ff3d9a]3.[/c] 書きかえたいところをﾀｯﾌﾟして文字を入れる\n[c=#ff3d9a]4.[/c] 「ﾒﾆｭｰ」の✎から、ﾌﾟﾛﾌや自己紹介の中身を書く\n[c=#ff3d9a]5.[/c] 「⚙設定」で公開範囲とﾀｸﾞを決める\n[c=#ff3d9a]6.[/c] 「保存する」でできあがり[s=m/heart_pink.gif]\n\n[big]★ちょっとしたｺﾂ★[/big]\n・文字を選んでから「色」や「大」を押すと飾れるょ\n・「素材」から[s=m/star_yellow.gif]みたいな素材をはれるょ\n・ﾍﾟｰｼﾞゎ「ﾒﾆｭｰ」から12個まで追加できるょ\n\n[c=#ff3d9a]※本名・学校名・住んでる場所ゎ書かないでね[/c]"}, "pkiri": {"b": "[center][big][blink]☆ｷﾘ番報告☆[/blink][/big][/center]\n\nｷﾘ番ふんだ人ゎ、[c=#ff3d9a]BBS[/c]に\n「○○番ふみました!!」って書いてね♪\n\nｷﾘ番：100・500・777・1000・1111・2000・3333・5000・7777・10000\n\n[big]★ｷﾘ番ｹﾞｯﾀｰさん★[/big]\n（まだいないょ。一番乗りしてね[s=m/kira_twinkle.gif]）\n\n※踏み逃げ禁止ﾃﾞｽ(｀・ω・´)"}}}'::jsonb, 'public', now())
  on conflict (user_id) do update set data = excluded.data, visibility = 'public', updated_at = now();
  if not exists (select 1 from public.diaries where user_id = uid and title = 'めろﾋﾟｮﾝ☆はじめました♪') then
    insert into public.diaries (user_id, title, body, is_public, created_at) values (uid, 'めろﾋﾟｮﾝ☆はじめました♪', 'みなさんこんにちは(*´∀`*)ﾉ
めろﾋﾟｮﾝ☆運営です。

平成のｹｰﾀｲﾎﾑﾍﾟみたいに、自分だけの場所を作れるｻｲﾄを作りました!!
ﾌﾟﾛﾌ・日記・ﾘｱﾙ・BBS・質問箱…ぜんぶ自分の好きなように飾れるょ♪

まだβ版だから、気づいたことがあったら[c=#ff3d9a]お問い合わせ[/c]から教えてね。', true, '2026-11-15 20:00:00+09');
  end if;
  if not exists (select 1 from public.diaries where user_id = uid and title = 'ﾎﾑﾍﾟを作ったらやってほしいこと3つ') then
    insert into public.diaries (user_id, title, body, is_public, created_at) values (uid, 'ﾎﾑﾍﾟを作ったらやってほしいこと3つ', '[big]①ﾀｸﾞをつける[/big]
「⚙設定」からﾀｸﾞを選ぶと、ﾎﾑﾍﾟ検索で見つけてもらいやすくなるょ。

[big]②足あとを残す[/big]
気になるﾎﾑﾍﾟに行ったら、拍手やBBSでひとこと残すと仲良くなれるかも[s=m/heart_pink.gif]

[big]③ｷﾘ番を決める[/big]
ｶｳﾝﾀｰが777とかになった人にお礼する、平成ﾎﾑﾍﾟの伝統ﾃﾞｽ☆', true, '2026-11-16 21:00:00+09');
  end if;
  if not exists (select 1 from public.diaries where user_id = uid and title = '運営のｵﾘｼﾞﾅﾙ素材を置いたょ') then
    insert into public.diaries (user_id, title, body, is_public, created_at) values (uid, '運営のｵﾘｼﾞﾅﾙ素材を置いたょ', '素材置き場に、運営が作ったﾄﾞｯﾄ絵の素材を置きました[s=m/kira_twinkle.gif]
ﾊｰﾄ・星・ﾘﾎﾞﾝ・NEW!・ﾗｲﾝとか、ぜんぶで21個!!

編集画面の「素材」ﾎﾞﾀﾝからそのまま使えるょ♪
自分で作った素材も、素材置き場に置いてみてね。', true, '2026-11-17 19:00:00+09');
  end if;
  if not exists (select 1 from public.bbs_posts where user_id = uid and body = 'めろﾋﾟｮﾝ☆へようこそ(*´∀`*)ﾉ ここゎみんなの掲示板だょ♪ ﾎﾑﾍﾟできたら、ここで宣伝してOK!! ※個人情報や、ほかのSNSへのお誘いゎ書かないでね') then
    insert into public.bbs_posts (user_id, body, created_at) values (uid, 'めろﾋﾟｮﾝ☆へようこそ(*´∀`*)ﾉ ここゎみんなの掲示板だょ♪ ﾎﾑﾍﾟできたら、ここで宣伝してOK!! ※個人情報や、ほかのSNSへのお誘いゎ書かないでね', '2026-11-15 20:05:00+09');
  end if;
  if not exists (select 1 from public.bbs_posts where user_id = uid and body = '【自己紹介ｽﾚ】はじめましての人ゎ、ﾆｯｸﾈｰﾑと好きなものをひとこと書いてね☆ 運営ゎﾄﾞｯﾄ絵とｷﾗｷﾗしたﾎﾑﾍﾟが好きﾃﾞｽ♪') then
    insert into public.bbs_posts (user_id, body, created_at) values (uid, '【自己紹介ｽﾚ】はじめましての人ゎ、ﾆｯｸﾈｰﾑと好きなものをひとこと書いてね☆ 運営ゎﾄﾞｯﾄ絵とｷﾗｷﾗしたﾎﾑﾍﾟが好きﾃﾞｽ♪', '2026-11-16 21:10:00+09');
  end if;
  if not exists (select 1 from public.bbs_posts where user_id = uid and body = '運営のｵﾘｼﾞﾅﾙ素材を素材置き場に置いたょ[s=m/heart_beat.gif] 編集画面の「素材」からも選べるょ!!') then
    insert into public.bbs_posts (user_id, body, created_at) values (uid, '運営のｵﾘｼﾞﾅﾙ素材を素材置き場に置いたょ[s=m/heart_beat.gif] 編集画面の「素材」からも選べるょ!!', '2026-11-17 19:05:00+09');
  end if;
end $$;

-- 確認
select p.hp_id, p.nickname, h.visibility, (select count(*) from public.diaries d where d.user_id = p.id) as diaries
from public.profiles p join public.homepages h on h.user_id = p.id where p.hp_id = 'meropyon_unei';
