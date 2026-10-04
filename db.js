/* めろﾋﾟｮﾝ☆ データのやりとり（引っ越し時はこのファイルだけ書き換える） */
(function(){
var URL='https://sxlcqlgkcsavaavcoduc.supabase.co';
var KEY='sb_publishable_YhIWbfIEOGUtrh-xPrM59w_qBJBABz0';
var sb=window.supabase.createClient(URL,KEY);
var IMG=URL+'/storage/v1/object/public/hp/';
var SOZ=URL+'/storage/v1/object/public/sozai/';
var SITE=location.origin+location.pathname.replace(/[^\/]*$/,'');
function err(e){
  var m=(e&&e.message)||String(e);
  if(/Invalid login/i.test(m))return 'ﾒｱﾄﾞかﾊﾟｽﾜｰﾄﾞがちがうょ';
  if(/Email not confirmed/i.test(m))return '確認ﾒｰﾙのﾘﾝｸを押してからﾛｸﾞｲﾝしてね';
  if(/already registered/i.test(m))return 'そのﾒｱﾄﾞゎもう登録されてるょ';
  if(/at least 6/i.test(m))return 'ﾊﾟｽﾜｰﾄﾞゎ6文字以上にしてね';
  if(/rate limit/i.test(m))return '混みあってるみたい…少し時間をおいてね';
  if(/invalid/i.test(m)&&/email/i.test(m))return 'ﾒｱﾄﾞの形がおかしいかも';
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
  if(/exceeded the maximum|too large/i.test(m))return '画像が大きすぎるょ';
  if(/row-level security|permission denied|Unauthorized/i.test(m))return 'ﾏｲﾍﾟｰｼﾞで「はじめの設定」をしてからね';
  return 'ｴﾗｰ: '+m;
}
async function run(p){var r=await p;if(r.error)throw new Error(err(r.error));return r.data}
window.DB={
  esc:function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})},
  time:function(s){var d=new Date(s);return (d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)},
  me:async function(){var r=await sb.auth.getSession();return r.data.session?r.data.session.user:null},
  signUp:function(email,pass,nickname){return run(sb.auth.signUp({email:email,password:pass,options:{data:{nickname:nickname},emailRedirectTo:SITE+'mypage.html'}}))},
  logIn:function(email,pass){return run(sb.auth.signInWithPassword({email:email,password:pass}))},
  logOut:function(){return run(sb.auth.signOut())},
  getProfile:async function(id){var d=await run(sb.from('profiles').select('id,nickname,bio,created_at').eq('id',id).limit(1));return d[0]||null},
  saveProfile:function(id,nickname,bio){return run(sb.from('profiles').update({nickname:nickname,bio:bio}).eq('id',id))},
  posts:function(n){return run(sb.from('bbs_posts').select('id,user_id,body,created_at,profiles(nickname)').order('created_at',{ascending:false}).limit(n||50))},
  addPost:function(body){return run(sb.from('bbs_posts').insert({body:body}))},
  delPost:function(id){return run(sb.from('bbs_posts').delete().eq('id',id))},
  myInfo:async function(id){var d=await run(sb.from('private_info').select('birth_ym,needs_guardian,guardian_approved,leave_footprints,vis_locked,created_at').eq('id',id).limit(1));return d[0]||null},
  myHpId:async function(id){var d=await run(sb.from('profiles').select('hp_id').eq('id',id).limit(1));return d[0]?d[0].hp_id:null},
  idOk:function(p){return run(sb.rpc('hp_id_available',{p:p}))},
  setup:function(hpId,birth,guardian){return run(sb.rpc('setup_account',{p_hp_id:hpId,p_birth:birth,p_guardian:guardian||''}))},
  getHp:async function(hpId){var d=await run(sb.from('profiles').select('id,nickname,hp_id,homepages(data,visibility,counter,updated_at,suspended)').eq('hp_id',hpId).limit(1));
    if(!d[0])return null;var h=d[0].homepages;if(Array.isArray(h))h=h[0]||null;return {id:d[0].id,nickname:d[0].nickname,hp_id:d[0].hp_id,hp:h}},
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
  delMaterial:async function(id,path){await run(sb.from('materials').delete().eq('id',id));await run(sb.storage.from('sozai').remove([path]))},
  sozOk:function(p){return /^[0-9a-f-]{36}\/[0-9a-z]+\.(gif|png|webp)$/.test(p||'')},
  uploadImg:async function(uid,blob){var path=uid+'/'+Date.now()+'.jpg';await run(sb.storage.from('hp').upload(path,blob,{contentType:'image/jpeg',upsert:false}));return {path:path,url:IMG+path}},
  delImg:function(path){return run(sb.storage.from('hp').remove([path]))},
  diaries:function(o){return run(sb.from('diaries').select('id,title,body,is_public,created_at').eq('user_id',o).order('created_at',{ascending:false}).limit(100))},
  addDiary:function(t,b,pub){return run(sb.from('diaries').insert({title:t,body:b,is_public:pub}))},
  setDiaryPub:function(id,pub){return run(sb.from('diaries').update({is_public:pub}).eq('id',id))},
  delDiary:function(id){return run(sb.from('diaries').delete().eq('id',id))},
  photos:function(o){return run(sb.from('photos').select('id,path,caption,created_at').eq('user_id',o).order('created_at',{ascending:false}).limit(100))},
  addPhoto:function(path,cap){return run(sb.from('photos').insert({path:path,caption:cap}))},
  delPhoto:function(id){return run(sb.from('photos').delete().eq('id',id))},
  hpPosts:function(o){return run(sb.from('hp_bbs').select('id,user_id,body,created_at,profiles!hp_bbs_user_id_fkey(nickname,hp_id)').eq('owner',o).order('created_at',{ascending:false}).limit(100))},
  addHpPost:function(o,b){return run(sb.from('hp_bbs').insert({owner:o,body:b}))},
  delHpPost:function(id){return run(sb.from('hp_bbs').delete().eq('id',id))},
  block:function(u){return run(sb.from('hp_blocks').insert({blocked:u}))},
  questions:function(o){return run(sb.from('questions').select('id,body,answer,answered_at,created_at').eq('owner',o).order('created_at',{ascending:false}).limit(100))},
  ask:function(o,b){return run(sb.from('questions').insert({owner:o,body:b}))},
  answer:function(id,a){return run(sb.from('questions').update({answer:a,answered_at:new Date().toISOString()}).eq('id',id))},
  delQ:function(id){return run(sb.from('questions').delete().eq('id',id))},
  blockAsker:function(id){return run(sb.rpc('block_asker',{p_qid:id}))},
  clap:function(o){return run(sb.rpc('hp_clap',{p_owner:o}))},
  clapCount:function(o){return run(sb.rpc('hp_clap_count',{p_owner:o}))},
  footprint:function(o){return run(sb.rpc('hp_footprint',{p_owner:o}))},
  footprints:function(o){return run(sb.from('footprints').select('visited_at,profiles!footprints_visitor_fkey(nickname,hp_id)').eq('owner',o).order('visited_at',{ascending:false}).limit(100))},
  setFoot:function(v){return run(sb.rpc('set_footprints',{p:v}))},
  friendWith:async function(me,o){var d=await run(sb.from('friend_requests').select('id,from_id,status').or('and(from_id.eq.'+me+',to_id.eq.'+o+'),and(from_id.eq.'+o+',to_id.eq.'+me+')').limit(1));return d[0]||null},
  requestFriend:function(o){return run(sb.rpc('request_friend',{p_to:o}))},
  acceptFriend:function(id){return run(sb.rpc('accept_friend',{p_id:id}))},
  delFriend:function(id){return run(sb.from('friend_requests').delete().eq('id',id))},
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
  visit:function(hpId){return run(sb.rpc('hp_visit',{p_hp_id:hpId}))},
  age:function(ym){var p=String(ym).split('-'),y=+p[0],m=+p[1],t=new Date(),last=new Date(y,m,0).getDate();
    var a=t.getFullYear()-y;if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<last))a--;return a}
};
})();
