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
  delPost:function(id){return run(sb.from('bbs_posts').delete().eq('id',id))}
};
})();
