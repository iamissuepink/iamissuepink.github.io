/* めろﾋﾟｮﾝ☆ データのやりとり（引っ越し時はこのファイルだけ書き換える） */
(function(){
var URL='https://sxlcqlgkcsavaavcoduc.supabase.co';
var KEY='sb_publishable_YhIWbfIEOGUtrh-xPrM59w_qBJBABz0';
var sb=window.supabase.createClient(URL,KEY);
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
  if(/row-level security|permission denied/i.test(m))return 'ﾏｲﾍﾟｰｼﾞで「はじめの設定」をしてからね';
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
  myInfo:async function(id){var d=await run(sb.from('private_info').select('birth_ym,needs_guardian,guardian_approved').eq('id',id).limit(1));return d[0]||null},
  myHpId:async function(id){var d=await run(sb.from('profiles').select('hp_id').eq('id',id).limit(1));return d[0]?d[0].hp_id:null},
  idOk:function(p){return run(sb.rpc('hp_id_available',{p:p}))},
  setup:function(hpId,birth,guardian){return run(sb.rpc('setup_account',{p_hp_id:hpId,p_birth:birth,p_guardian:guardian||''}))},
  getHp:async function(hpId){var d=await run(sb.from('profiles').select('id,nickname,hp_id,homepages(data,visibility,counter,updated_at)').eq('hp_id',hpId).limit(1));
    if(!d[0])return null;var h=d[0].homepages;if(Array.isArray(h))h=h[0]||null;return {id:d[0].id,nickname:d[0].nickname,hp_id:d[0].hp_id,hp:h}},
  saveHp:function(uid,data,vis){return run(sb.from('homepages').upsert({user_id:uid,data:data,visibility:vis,updated_at:new Date().toISOString()}))},
  visit:function(hpId){return run(sb.rpc('hp_visit',{p_hp_id:hpId}))},
  age:function(ym){var p=String(ym).split('-'),y=+p[0],m=+p[1],t=new Date(),last=new Date(y,m,0).getDate();
    var a=t.getFullYear()-y;if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<last))a--;return a}
};
})();
