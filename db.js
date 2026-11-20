/* めろﾋﾟｮﾝ☆ データのやりとり（引っ越し時はこのファイルだけ書き換える） */
(function(){
var URL='https://sxlcqlgkcsavaavcoduc.supabase.co';
var KEY='sb_publishable_YhIWbfIEOGUtrh-xPrM59w_qBJBABz0';
var sb=window.supabase.createClient(URL,KEY);
var IMG=URL+'/storage/v1/object/public/hp/';
var SOZ=URL+'/storage/v1/object/public/sozai/';
var SITE=location.origin+location.pathname.replace(/[^\/]*$/,'');
function err(e){
  var m=(e&&e.message)||String(e),c=(e&&e.code)||'',st=(e&&e.status)||'';
  if(window.console)console.warn('[めろﾋﾟｮﾝ☆] ｴﾗｰ',c,st,m,e);
  var tag=' ['+(c||st||'error')+']';
  /* 認証まわり（Supabase Auth のｴﾗｰｺｰﾄﾞ） */
  if(c==='over_email_send_rate_limit'||/email rate limit/i.test(m))return 'ﾒｰﾙの送信回数が上限に達してるょ。めろﾋﾟｮﾝ☆側のﾒｰﾙ設定の問題で、あなたのせいじゃないょ。運営が直すまで少し待ってね'+tag;
  if(c==='email_address_not_authorized'||/not authorized/i.test(m))return '今ゎ確認ﾒｰﾙを送れない設定になってるょ（運営がﾒｰﾙ設定を準備中）。少し待ってね'+tag;
  if(c==='over_request_rate_limit'||/after (\d+) seconds?/i.test(m)){var s=(m.match(/after (\d+) seconds?/i)||[])[1];return (s?'あと'+s+'秒':'少し')+'待ってからもう一回押してね（短い間に何回も送れないょ）'+tag}
  if(/rate limit|too many/i.test(m)||st===429)return '短い間に何回も送られたから、ちょっとお休み中…数分あけてね'+tag;
  if(c==='signup_disabled')return '今ゎ新しい登録を止めてるょ'+tag;
  if(c==='weak_password'||/at least 6/i.test(m))return 'ﾊﾟｽﾜｰﾄﾞゎ6文字以上にしてね';
  if(c==='email_address_invalid'||(/invalid/i.test(m)&&/email/i.test(m)))return 'ﾒｱﾄﾞの形がおかしいかも（使えないﾄﾞﾒｲﾝのこともあるょ）'+tag;
  if(c==='user_already_exists'||c==='email_exists'||/already registered/i.test(m))return 'そのﾒｱﾄﾞゎもう登録されてるょ。ﾛｸﾞｲﾝしてね';
  if(c==='invalid_credentials'||/Invalid login/i.test(m))return 'ﾒｱﾄﾞかﾊﾟｽﾜｰﾄﾞがちがうょ';
  if(c==='email_not_confirmed'||/Email not confirmed/i.test(m))return '確認ﾒｰﾙのﾘﾝｸを押してからﾛｸﾞｲﾝしてね';
  if(/Failed to fetch|NetworkError|Load failed/i.test(m))return '通信できなかったょ。電波を確認してもう一回ためしてね'+tag;
  /* めろﾋﾟｮﾝ☆の決まり（SQLの関数から返るｺｰﾄﾞ） */
  if(/id_taken/.test(m))return 'そのIDゎ使えないか、もう使われてるょ';
  if(/already_set/.test(m))return 'はじめの設定ゎもう終わってるょ';
  if(/need_guardian/.test(m))return '12歳以下の人ゎ保護者のﾒｱﾄﾞが必要だょ';
  if(/bad_birth/.test(m))return '生まれた年と月を確認してね';
  if(/friend_age/.test(m))return '年齢のきまりで、この人とゎめろ友になれないょ';
  if(/friend_exists/.test(m))return 'もう申請してるか、めろ友になってるょ';
  if(/not_ready/.test(m))return 'ﾛｸﾞｲﾝして「はじめの設定」をしてからね';
  if(/cannot_accept/.test(m))return 'この申請ゎ承認できないょ';
  if(/vis_locked/.test(m))return '公開範囲ゎ保護者の人がロックしてるょ';
  if(/cannot_approve/.test(m))return '承認できなかったょ（ﾒｰﾙｱﾄﾞﾚｽを確認してね）';
  if(/not_guardian|not_admin/.test(m))return 'この操作ゎできないょ';
  if(/not_deleted/.test(m))return '消せなかったょ（自分のものじゃないか、もう消えてるかも）';
  if(/hp_backups/.test(m)&&/row-level/.test(m))return '保存BOXがいっぱいだょ。いらないのを消してね';
  if(/exceeded the maximum|too large/i.test(m))return '画像が大きすぎるょ';
  if(/row-level security|permission denied|Unauthorized/i.test(m))return 'この操作ゎできなかったょ。ﾏｲﾍﾟｰｼﾞで「はじめの設定」が終わってるか確認してね'+tag;
  /* ここから先ゎ想定してないｴﾗｰ。DBの生のﾒｯｾｰｼﾞ（ﾃｰﾌﾞﾙ名・制約名など）を利用者に見せないで、必ず日本語の案内文にする */
  if(c==='23514'||/violates check constraint/i.test(m))return '入力した内容が条件に合ってないみたい。少し短くするか内容を変えてもう一回ためしてね'+tag;
  if(c==='23505'||/duplicate key|already exists/i.test(m))return 'もう同じものがあるみたいだょ'+tag;
  if(/^\d{5}$/.test(c)||/violates|constraint|relation ".*" does not exist|column ".*" does not exist/i.test(m))return '予期しないｴﾗｰが起きたょ。時間をおいてもう一回ためしてね。直らなければ運営まで連絡してね'+tag;
  return '予期しないｴﾗｰが起きたょ。時間をおいてもう一回ためしてね'+tag;
}
async function run(p){var r=await p;if(r.error)throw new Error(err(r.error));return r.data}
/* 消したはずなのに消えてない（権限で0件になった）ときにちゃんとｴﾗｰにする */
async function del(q){var d=await run(q.select('id'));if(!d||!d.length)throw new Error(err({message:'not_deleted'}));return d}
window.DB={
  esc:function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})},
  time:function(s){var d=new Date(s);return (d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)},
  me:async function(){var r=await sb.auth.getSession();return r.data.session?r.data.session.user:null},
  signUp:async function(email,pass,nickname,extra){var data=Object.assign({nickname:nickname},extra||{});
    var d=await run(sb.auth.signUp({email:email,password:pass,options:{data:data,emailRedirectTo:SITE+'mypage.html'}}));
    if(d&&d.user&&Array.isArray(d.user.identities)&&!d.user.identities.length)throw new Error('そのﾒｱﾄﾞゎもう登録されてるょ。ﾛｸﾞｲﾝしてね（ﾊﾟｽﾜｰﾄﾞを忘れたら「ﾊﾟｽﾜｰﾄﾞを忘れた？」から）');
    return d},
  meta:async function(){var r=await sb.auth.getUser();return (r.data&&r.data.user&&r.data.user.user_metadata)||{}},
  /* おしらせ：めろ友申請・質問・BBS・拍手・足あと・めろ友の新着日記をまとめる（最後に見た時刻ゎﾛｸﾞｲﾝ情報に保存→どの端末でも同じ） */
  notices:async function(uid){var safe=async function(f,d){try{return await f()}catch(e){return d}};
    var md=await safe(async function(){var r=await sb.auth.getUser();return r.data.user.user_metadata||{}},{}),seen=md.seen||{},at=seen.at||'1970-01-01';
    var fr=await safe(function(){return DB.incoming(uid)},[]);
    var qs=(await safe(function(){return DB.questions(uid)},[])).filter(function(q){return !q.answer});
    var bb=(await safe(function(){return DB.hpPosts(uid)},[])).filter(function(p){return p.user_id!==uid}).slice(0,20);
    var cl=+(await safe(function(){return DB.clapCount(uid)},0))||0;
    var ft=(await safe(function(){return DB.footprints(uid)},[])).slice(0,20);
    var fids={};(await safe(function(){return DB.hpFriends(uid)},[])).forEach(function(f){if(f.hp_id)fids[f.hp_id]=1});
    var feed=Object.keys(fids).length?(await safe(function(){return DB.newDiaries(100)},[])).filter(function(d){return fids[d.hp_id]}).slice(0,20):[];
    function nw(t){return t&&t>at}
    var n=fr.length+qs.filter(function(q){return nw(q.created_at)}).length+bb.filter(function(p){return nw(p.created_at)}).length+Math.max(0,cl-(seen.claps||0));
    return {count:n,seenAt:at,claps:cl,newClaps:Math.max(0,cl-(seen.claps||0)),friendReq:fr,questions:qs,bbs:bb,foot:ft,feed:feed,isNew:nw}},
  noticeCount:async function(uid){var md={};try{md=(await sb.auth.getUser()).data.user.user_metadata||{}}catch(e){}var seen=md.seen||{},at=seen.at||'1970-01-01',n=0;
    try{n+=(await DB.incoming(uid)).length}catch(e){}
    try{n+=(await run(sb.from('questions').select('id').eq('owner',uid).is('answer',null).gt('created_at',at))).length}catch(e){}
    try{n+=(await run(sb.from('hp_bbs').select('id').eq('owner',uid).neq('user_id',uid).gt('created_at',at))).length}catch(e){}
    try{n+=Math.max(0,(+(await DB.clapCount(uid))||0)-(seen.claps||0))}catch(e){}
    return n},
  markSeen:function(claps){return run(sb.auth.updateUser({data:{seen:{at:new Date().toISOString(),claps:claps||0}}}))},
  setMeta:function(o){return run(sb.auth.updateUser({data:o}))},
  exportAll:async function(uid){
    var p=await run(sb.from('profiles').select('nickname,bio,hp_id,created_at').eq('id',uid).limit(1));p=p[0]||{};
    var h=await run(sb.from('homepages').select('data,visibility,counter,updated_at').eq('user_id',uid).limit(1));
    var safe=async function(f){try{return await f()}catch(e){return {error:e.message}}};
    return {app:'meropyon',version:1,exported_at:new Date().toISOString(),hp_id:p.hp_id||'',profile:p,homepage:h[0]||null,
      diaries:await safe(function(){return run(sb.from('diaries').select('title,body,is_public,created_at').eq('user_id',uid).order('created_at',{ascending:true}))}),
      photos:await safe(async function(){var L=await run(sb.from('photos').select('path,caption,created_at').eq('user_id',uid).order('created_at',{ascending:true}));return L.map(function(x){return {url:IMG+x.path,caption:x.caption,created_at:x.created_at}})}),
      backups:await safe(function(){return run(sb.from('hp_backups').select('name,data,created_at').eq('user_id',uid).order('created_at',{ascending:true}))}),
      questions:await safe(function(){return run(sb.from('questions').select('body,answer,answered_at,created_at').eq('owner',uid).not('answer','is',null))})}},
  importHp:async function(uid,hp){var cur=await run(sb.from('homepages').select('data,visibility').eq('user_id',uid).limit(1));
    if(cur[0]&&cur[0].data){var d=new Date();await run(sb.from('hp_backups').insert({name:'戻す前 '+(d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2),data:cur[0].data}))}
    var vis=cur[0]?cur[0].visibility:(hp.visibility||'members');
    return run(sb.from('homepages').upsert({user_id:uid,data:hp.data,visibility:vis,updated_at:new Date().toISOString()}))},
  clearMeta:function(keys){var o={};keys.forEach(function(k){o[k]=null});return run(sb.auth.updateUser({data:o}))},
  san:function(n){n=String(n||'').trim()||'ななし';return /(さん|ちゃん|ﾁｬﾝ|くん|様|さま)[☆★♪♡✧]*$/.test(n)?n:n+'さん'},
  resetPw:function(email){return run(sb.auth.resetPasswordForEmail(email,{redirectTo:SITE+'reset.html'}))},
  newPw:function(pass){return run(sb.auth.updateUser({password:pass}))},
  onAuth:function(f){return sb.auth.onAuthStateChange(f)},
  logIn:function(email,pass){return run(sb.auth.signInWithPassword({email:email,password:pass}))},
  logOut:function(){return run(sb.auth.signOut())},
  getProfile:async function(id){var d=await run(sb.from('profiles').select('id,nickname,bio,created_at').eq('id',id).limit(1));return d[0]||null},
  saveProfile:function(id,nickname,bio){return run(sb.from('profiles').update({nickname:nickname,bio:bio}).eq('id',id))},
  posts:function(n){return run(sb.from('bbs_posts').select('id,user_id,body,created_at,profiles(nickname)').order('created_at',{ascending:false}).limit(n||50))},
  addPost:function(body){return run(sb.from('bbs_posts').insert({body:body}))},
  delPost:function(id){return del(sb.from('bbs_posts').delete().eq('id',id))},
  myInfo:async function(id){var d=await run(sb.from('private_info').select('birth_ym,needs_guardian,guardian_approved,leave_footprints,vis_locked,created_at').eq('id',id).limit(1));return d[0]||null},
  myHpId:async function(id){var d=await run(sb.from('profiles').select('hp_id').eq('id',id).limit(1));return d[0]?d[0].hp_id:null},
  idOk:function(p){return run(sb.rpc('hp_id_available',{p:p}))},
  setup:function(hpId,birth,guardian){return run(sb.rpc('setup_account',{p_hp_id:hpId,p_birth:birth,p_guardian:guardian||''}))},
  getHp:async function(hpId){var d=await run(sb.from('profiles').select('id,nickname,hp_id,created_at,homepages(data,visibility,counter,updated_at,suspended)').eq('hp_id',hpId).limit(1));
    if(!d[0])return null;var h=d[0].homepages;if(Array.isArray(h))h=h[0]||null;return {id:d[0].id,nickname:d[0].nickname,hp_id:d[0].hp_id,created_at:d[0].created_at,hp:h}},
  saveHp:function(uid,data,vis){return run(sb.from('homepages').upsert({user_id:uid,data:data,visibility:vis,updated_at:new Date().toISOString()}))},
  imgBase:IMG,sozBase:SOZ,
  TAGCATS:{"音楽": ["J-POP", "K-POP", "ﾎﾞｶﾛ", "ｱﾆｿﾝ", "ﾛｯｸ", "ﾊﾞﾝﾄﾞ", "ｱｲﾄﾞﾙ", "洋楽", "平成ｿﾝｸﾞ", "歌ってみた", "楽器", "作曲・DTM"], "ｱﾆﾒ・漫画・ｹﾞｰﾑ": ["ｱﾆﾒ", "漫画", "ﾗﾉﾍﾞ", "ｹﾞｰﾑ", "ｽﾏﾎｹﾞｰﾑ", "ﾚﾄﾛｹﾞｰﾑ", "VTuber", "声優", "特撮", "ｺｽﾌﾟﾚ"], "推し活": ["推し活", "ｸﾞｯｽﾞ集め", "ﾗｲﾌﾞ・遠征", "痛ﾊﾞｯｸﾞ", "ﾄﾚｶ", "同担歓迎", "推しの話"], "ﾌｧｯｼｮﾝ・美容": ["ﾌｧｯｼｮﾝ", "平成ｷﾞｬﾙ", "地雷系", "量産型", "ｽﾄﾘｰﾄ", "古着", "ﾛﾘｰﾀ", "ｺｽﾒ", "ﾈｲﾙ", "ﾍｱｱﾚﾝｼﾞ", "ｽｷﾝｹｱ"], "平成・Y2K": ["平成・Y2K", "平成ﾚﾄﾛ", "Y2K", "ｶﾞﾗｹｰ", "ﾌﾟﾘｸﾗ", "ﾃﾞｺﾒ", "ｷﾞｬﾙ文字", "ﾎﾑﾍﾟ文化"], "創作": ["ｲﾗｽﾄ", "創作", "一次創作", "二次創作", "小説", "詩・ﾎﾟｴﾑ", "漫画を描く", "ﾄﾞｯﾄ絵", "手芸・ﾊﾝﾄﾞﾒｲﾄﾞ", "写真", "動画編集", "ﾌﾟﾛｸﾞﾗﾐﾝｸﾞ"], "学校・勉強": ["勉強", "受験", "部活", "英語", "資格", "進路"], "趣味": ["読書", "映画", "ﾄﾞﾗﾏ", "韓国ﾄﾞﾗﾏ", "ｶﾌｪ巡り", "旅行", "ｶﾒﾗ", "鉄道", "料理", "お菓子作り", "ｸﾞﾙﾒ", "ｱｳﾄﾄﾞｱ"], "ｽﾎﾟｰﾂ": ["ｽﾎﾟｰﾂ", "ｻｯｶｰ", "野球", "ﾊﾞｽｹ", "ﾊﾞﾚｰ", "ﾃﾆｽ", "ﾀﾞﾝｽ", "陸上", "水泳", "ﾌｨｷﾞｭｱ", "ｽﾎﾟｰﾂ観戦"], "生き物": ["ﾍﾟｯﾄ", "犬", "猫", "うさぎ", "ﾊﾑｽﾀｰ", "鳥", "爬虫類", "熱帯魚", "動物園・水族館"], "日常": ["日記", "つぶやき", "雑談", "ｺﾞﾊﾝ記録", "ﾙｰﾃｨﾝ"], "交流": ["めろ友募集", "ﾘﾝｸ募集", "素材配布", "ｷﾘ番", "相互歓迎"]},
  TAGS:["平成・Y2K", "ｱﾆﾒ", "ﾎﾞｶﾛ", "推し活", "ｲﾗｽﾄ", "ｹﾞｰﾑ", "ﾌｧｯｼｮﾝ", "K-POP", "創作", "日記", "J-POP", "ｱﾆｿﾝ", "ﾛｯｸ", "ﾊﾞﾝﾄﾞ", "ｱｲﾄﾞﾙ", "洋楽", "平成ｿﾝｸﾞ", "歌ってみた", "楽器", "作曲・DTM", "漫画", "ﾗﾉﾍﾞ", "ｽﾏﾎｹﾞｰﾑ", "ﾚﾄﾛｹﾞｰﾑ", "VTuber", "声優", "特撮", "ｺｽﾌﾟﾚ", "ｸﾞｯｽﾞ集め", "ﾗｲﾌﾞ・遠征", "痛ﾊﾞｯｸﾞ", "ﾄﾚｶ", "同担歓迎", "推しの話", "平成ｷﾞｬﾙ", "地雷系", "量産型", "ｽﾄﾘｰﾄ", "古着", "ﾛﾘｰﾀ", "ｺｽﾒ", "ﾈｲﾙ", "ﾍｱｱﾚﾝｼﾞ", "ｽｷﾝｹｱ", "平成ﾚﾄﾛ", "Y2K", "ｶﾞﾗｹｰ", "ﾌﾟﾘｸﾗ", "ﾃﾞｺﾒ", "ｷﾞｬﾙ文字", "ﾎﾑﾍﾟ文化", "一次創作", "二次創作", "小説", "詩・ﾎﾟｴﾑ", "漫画を描く", "ﾄﾞｯﾄ絵", "手芸・ﾊﾝﾄﾞﾒｲﾄﾞ", "写真", "動画編集", "ﾌﾟﾛｸﾞﾗﾐﾝｸﾞ", "勉強", "受験", "部活", "英語", "資格", "進路", "読書", "映画", "ﾄﾞﾗﾏ", "韓国ﾄﾞﾗﾏ", "ｶﾌｪ巡り", "旅行", "ｶﾒﾗ", "鉄道", "料理", "お菓子作り", "ｸﾞﾙﾒ", "ｱｳﾄﾄﾞｱ", "ｽﾎﾟｰﾂ", "ｻｯｶｰ", "野球", "ﾊﾞｽｹ", "ﾊﾞﾚｰ", "ﾃﾆｽ", "ﾀﾞﾝｽ", "陸上", "水泳", "ﾌｨｷﾞｭｱ", "ｽﾎﾟｰﾂ観戦", "ﾍﾟｯﾄ", "犬", "猫", "うさぎ", "ﾊﾑｽﾀｰ", "鳥", "爬虫類", "熱帯魚", "動物園・水族館", "つぶやき", "雑談", "ｺﾞﾊﾝ記録", "ﾙｰﾃｨﾝ", "めろ友募集", "ﾘﾝｸ募集", "素材配布", "ｷﾘ番", "相互歓迎"],

  newDiaries:function(n){return run(sb.rpc('new_diaries',{lim:n||20}))},
  hpList:function(mode,q,tag,n){return run(sb.rpc('hp_list',{mode:mode,q:q||'',tag:tag||'',lim:n||20}))},
  randomHp:function(){return run(sb.rpc('random_hp'))},
  materials:function(n,uid){var x=sb.from('materials').select('id,user_id,path,title,created_at,profiles(nickname,hp_id)').order('created_at',{ascending:false}).limit(n||60);if(uid)x=x.eq('user_id',uid);return run(x)},
  addMaterial:async function(uid,file,title){var ext={'image/gif':'gif','image/png':'png','image/webp':'webp'}[file.type];if(!ext)throw new Error('gif・png・webpだけ使えるょ');
    if(file.size>307200)throw new Error('300KBまでだょ');var path=uid+'/'+Date.now()+'.'+ext;
    await run(sb.storage.from('sozai').upload(path,file,{contentType:file.type,upsert:false}));await run(sb.from('materials').insert({path:path,title:title}));return path},
  delMaterial:async function(id,path){await del(sb.from('materials').delete().eq('id',id));await run(sb.storage.from('sozai').remove([path]))},
  sozOk:function(p){return /^[0-9a-f-]{36}\/[0-9a-z]+\.(gif|png|webp)$/.test(p||'')||/^m\/[a-z0-9_]{1,30}\.(gif|png)$/.test(p||'')},
  SOZCATS:['ﾊｰﾄ','星・ｷﾗｷﾗ','ﾘﾎﾞﾝ','文字','ﾗｲﾝ','その他'],
  sozCat:function(path,title){var t=String(title||'')+' '+String(path||'');
    if(/ﾗｲﾝ|らいん|ライン|line|線/i.test(t))return 'ﾗｲﾝ';    if(/ﾊｰﾄ|はーと|ハート|heart|♡|♥/i.test(t))return 'ﾊｰﾄ';if(/星|ｷﾗ|きら|キラ|star|kira|☆|★/i.test(t))return '星・ｷﾗｷﾗ';
    if(/ﾘﾎﾞﾝ|りぼん|リボン|ribbon/i.test(t))return 'ﾘﾎﾞﾝ';if(/ﾗｲﾝ|らいん|ライン|line|線/i.test(t))return 'ﾗｲﾝ';
    if(/NEW|UP!|LOVE|THANKS|文字|ﾛｺﾞ|welcome/i.test(t))return '文字';return 'その他'},
  sozUrl:function(p){p=String(p||'');return p.indexOf('m/')===0?SITE+'img/sozai/'+p.slice(2):SOZ+p},
  OFFICIAL:[['m/heart_pink.gif','ﾋﾟﾝｸのﾊｰﾄ'],['m/heart_beat.gif','ﾄﾞｷﾄﾞｷﾊｰﾄ'],['m/heart_blue.gif','水色のﾊｰﾄ'],['m/heart_purple.gif','むらさきのﾊｰﾄ'],['m/kira_twinkle.gif','ｷﾗｷﾗ'],['m/star_yellow.gif','きいろの星'],['m/star_pink.gif','ﾋﾟﾝｸの星'],['m/ribbon_pink.gif','ﾋﾟﾝｸﾘﾎﾞﾝ'],['m/ribbon_black.gif','黒ﾘﾎﾞﾝ'],['m/new_blink.gif','NEW!'],['m/up.gif','UP!'],['m/love.gif','LOVE'],['m/thanks.gif','THANKS!'],['m/arrow_pink.gif','やじるし'],['m/clover.gif','ｸﾛｰﾊﾞｰ'],['m/moon.gif','おつきさま'],['m/note_pink.gif','おんぷ'],['m/usagi.gif','うさぎ'],['m/line_heart.gif','ﾊｰﾄのﾗｲﾝ'],['m/line_dot.gif','しましまﾗｲﾝ'],['m/line_star.gif','星のﾗｲﾝ']],
  uploadImg:async function(uid,blob){var path=uid+'/'+Date.now()+'.jpg';await run(sb.storage.from('hp').upload(path,blob,{contentType:'image/jpeg',upsert:false}));return {path:path,url:IMG+path}},
  delImg:function(path){return run(sb.storage.from('hp').remove([path]))},
  diaries:function(o){return run(sb.from('diaries').select('id,title,body,is_public,created_at').eq('user_id',o).order('created_at',{ascending:false}).limit(100))},
  addDiary:function(t,b,pub){return run(sb.from('diaries').insert({title:t,body:b,is_public:pub}))},
  setDiaryPub:function(id,pub){return run(sb.from('diaries').update({is_public:pub}).eq('id',id))},
  delDiary:function(id){return del(sb.from('diaries').delete().eq('id',id))},
  photos:function(o){return run(sb.from('photos').select('id,path,caption,created_at').eq('user_id',o).order('created_at',{ascending:false}).limit(100))},
  addPhoto:function(path,cap){return run(sb.from('photos').insert({path:path,caption:cap}))},
  delPhoto:function(id){return del(sb.from('photos').delete().eq('id',id))},
  hpPosts:function(o){return run(sb.from('hp_bbs').select('id,user_id,body,created_at,profiles!hp_bbs_user_id_fkey(nickname,hp_id)').eq('owner',o).order('created_at',{ascending:false}).limit(100))},
  addHpPost:function(o,b){return run(sb.from('hp_bbs').insert({owner:o,body:b}))},
  delHpPost:function(id){return del(sb.from('hp_bbs').delete().eq('id',id))},
  block:function(u){return run(sb.from('hp_blocks').insert({blocked:u}))},
  questions:function(o){return run(sb.from('questions').select('id,body,answer,answered_at,created_at').eq('owner',o).order('created_at',{ascending:false}).limit(100))},
  ask:function(o,b){return run(sb.from('questions').insert({owner:o,body:b}))},
  answer:function(id,a){return run(sb.from('questions').update({answer:a,answered_at:new Date().toISOString()}).eq('id',id))},
  delQ:function(id){return del(sb.from('questions').delete().eq('id',id))},
  blockAsker:function(id){return run(sb.rpc('block_asker',{p_qid:id}))},
  clap:function(o){return run(sb.rpc('hp_clap',{p_owner:o}))},
  clapCount:function(o){return run(sb.rpc('hp_clap_count',{p_owner:o}))},
  footprint:function(o){return run(sb.rpc('hp_footprint',{p_owner:o}))},
  footprints:function(o){return run(sb.from('footprints').select('visited_at,profiles!footprints_visitor_fkey(nickname,hp_id)').eq('owner',o).order('visited_at',{ascending:false}).limit(100))},
  setFoot:function(v){return run(sb.rpc('set_footprints',{p:v}))},
  friendWith:async function(me,o){var d=await run(sb.from('friend_requests').select('id,from_id,status').or('and(from_id.eq.'+me+',to_id.eq.'+o+'),and(from_id.eq.'+o+',to_id.eq.'+me+')').limit(1));return d[0]||null},
  requestFriend:function(o){return run(sb.rpc('request_friend',{p_to:o}))},
  acceptFriend:function(id){return run(sb.rpc('accept_friend',{p_id:id}))},
  delFriend:function(id){return del(sb.from('friend_requests').delete().eq('id',id))},
  incoming:function(me){return run(sb.from('friend_requests').select('id,created_at,profiles!friend_requests_from_id_fkey(nickname,hp_id)').eq('to_id',me).eq('status','pending').order('created_at',{ascending:false}))},
  hpFriends:function(o){return run(sb.rpc('hp_friends',{p_owner:o}))},
  report:function(t,id,hp,reason,detail){return run(sb.from('reports').insert({target_type:t,target_id:String(id),hp_id:hp||null,reason:reason,detail:detail||''}))},
  isAdmin:async function(uid){var d=await run(sb.from('admins').select('user_id').eq('user_id',uid).limit(1));return !!d[0]},
  reports:function(st){return run(sb.from('reports').select('*').eq('status',st||'open').order('created_at',{ascending:false}).limit(100))},
  setReport:function(id,st){return run(sb.from('reports').update({status:st}).eq('id',id))},
  adminDel:function(t,id){var tb={bbs:'bbs_posts',hp_bbs:'hp_bbs',diary:'diaries',photo:'photos',question:'questions',material:'materials'}[t];if(!tb)throw new Error('この種類ゎ削除できないょ');return run(sb.from(tb).delete().eq('id',id))},
  suspend:function(uid,v){return run(sb.rpc('admin_suspend',{p_user:uid,p:v}))},
  adminHps:function(){return run(sb.rpc('admin_hps',{lim:100}))},
  userByHp:async function(hp){var d=await run(sb.from('profiles').select('id').eq('hp_id',hp).limit(1));return d[0]?d[0].id:null},
  gChildren:function(){return run(sb.rpc('guardian_children'))},
  gApprove:function(c){return run(sb.rpc('guardian_approve',{p_child:c}))},
  gSet:function(c,vis,lock){return run(sb.rpc('guardian_set',{p_child:c,p_vis:vis,p_lock:lock}))},
  gFriends:function(){return run(sb.rpc('guardian_friend_requests'))},
  gOkFriend:function(id){return run(sb.rpc('guardian_ok_friend',{p_id:id}))},
  gNgFriend:function(id){return run(sb.rpc('guardian_ng_friend',{p_id:id}))},
  contact:function(cat,email,body){return run(sb.from('contacts').insert({category:cat,email:email||null,body:body}))},
  contacts:function(st){return run(sb.from('contacts').select('*').eq('status',st||'open').order('created_at',{ascending:false}).limit(100))},
  setContact:function(id,st){return run(sb.from('contacts').update({status:st}).eq('id',id))},
  deleteAccount:async function(uid){
    for(var b of ['hp','sozai']){try{var l=await sb.storage.from(b).list(uid,{limit:1000});if(l.data&&l.data.length)await sb.storage.from(b).remove(l.data.map(function(f){return uid+'/'+f.name}))}catch(e){}}
    await run(sb.rpc('delete_account'));await sb.auth.signOut()},
  backups:function(uid){return run(sb.from('hp_backups').select('id,name,data,created_at').eq('user_id',uid).order('created_at',{ascending:false}))},
  addBackup:function(name,data){return run(sb.from('hp_backups').insert({name:name,data:data}))},
  renBackup:async function(id,name){var r=await run(sb.from('hp_backups').update({name:name}).eq('id',id).select('id'));if(!r||!r.length)throw new Error('名前を変えられなかったょ（運営の設定待ち：step10.sql）');return r},
  delBackup:function(id){return del(sb.from('hp_backups').delete().eq('id',id))},
  visit:function(hpId){return run(sb.rpc('hp_visit',{p_hp_id:hpId}))},
  age:function(ym){var p=String(ym).split('-'),y=+p[0],m=+p[1],t=new Date(),last=new Date(y,m,0).getDate();
    var a=t.getFullYear()-y;if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<last))a--;return a}
};
})();
