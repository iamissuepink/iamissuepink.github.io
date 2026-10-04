(function(){
var $=function(i){return document.getElementById(i)},E=DB.esc;
function tm(s){var d=new Date(s);return (d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function isNew(s){return Date.now()-new Date(s).getTime()<3*86400000}
function ic(h){return h.icon&&h.icon.indexOf(DB.imgBase)===0?'<img src="'+E(h.icon)+'" alt="">':'<span class="ni">♡</span>'}
/* QR */
try{if(window.QRCode)new QRCode($('qr'),{text:location.origin+'/',width:86,height:86,colorDark:'#c8005f',colorLight:'#ffffff'})}catch(e){}
/* login box */
async function who(){var u=await DB.me();if(!u)return;
  $('lb-out').hidden=true;$('lb-in').hidden=false;$('regbtn').hidden=true;
  try{var p=await DB.getProfile(u.id);$('wname').textContent=p?p.nickname:'ななし'}catch(e){}
  try{var id=await DB.myHpId(u.id);if(id){$('hpe').href='hp.html?id='+id+'&edit=1'}}catch(e){}}
$('lgo').onclick=async function(){var b=this,m=$('lmsg');b.disabled=true;m.textContent='ﾛｸﾞｲﾝ中…';
  try{await DB.logIn($('lm').value.trim(),$('lp').value);m.textContent='';await who()}catch(e){m.textContent=e.message}b.disabled=false};
$('lp').onkeydown=function(e){if(e.key==='Enter')$('lgo').click()};
$('lout').onclick=async function(){await DB.logOut();location.reload()};
who().catch(function(){});
/* ID access */
function goId(){var v=$('qid').value.trim().toLowerCase();if(/^[a-z0-9_]{3,16}$/.test(v))location.href='hp.html?id='+v;else alert('めろIDゎ半角英小文字・数字・_ の3〜16文字だょ')}
$('qgo').onclick=goId;$('qid').onkeydown=function(e){if(e.key==='Enter')goId()};
/* tags */
$('cats').innerHTML=Object.keys(DB.TAGCATS).map(function(c){return '<div><b>■'+E(c)+'</b>'+DB.TAGCATS[c].map(function(t){return '<a href="search.html?tag='+encodeURIComponent(t)+'">'+E(t)+'</a>'}).join('/ ')+'</div>'}).join('');
$('catmore').onclick=function(){var c=$('cats');c.classList.toggle('fold');this.textContent=c.classList.contains('fold')?'▼ カテゴリをもっと見る':'▲ たたむ'};
$('rl').onclick=async function(){try{var id=await DB.randomHp();if(id)location.href='hp.html?id='+id;else alert('まだﾎﾑﾍﾟがないみたい')}catch(e){alert(e.message)}};
/* signs */
var S=['おひつじ','おうし','ふたご','かに','しし','おとめ','てんびん','さそり','いて','やぎ','みずがめ','うお'],M=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
$('signs').innerHTML=S.map(function(s,i){return '<a href="fortune.html?s='+i+'"><span>'+M[i]+'</span>'+s+'</a>'}).join('');
/* live data */
var none=function(id,t){$(id).innerHTML='<p class="msg">'+t+'</p>'};
DB.newDiaries(5).then(function(L){if(!L.length)return none('nd','まだ日記がないょ');$('nd').innerHTML=L.map(function(d){return '<a class="drow" href="hp.html?id='+E(d.hp_id)+'#diary"><b>'+E(d.title||'無題')+'</b>'+(isNew(d.created_at)?'<span class="new">NEW!</span>':'')+'<small>'+tm(d.created_at)+' by '+E(d.nickname)+'</small></a>'}).join('')}).catch(function(){none('nd','読み込めなかったょ')});
DB.hpList('pickup','','',5).then(function(L){if(!L.length)return none('pu','まだﾎﾑﾍﾟがないょ');$('pu').innerHTML=L.map(function(h){return '<a class="hrow" href="hp.html?id='+E(h.hp_id)+'">'+ic(h)+'<span><b style="color:#ff9ad5">'+E(h.title||h.nickname)+'</b><br><small style="color:#c9a2ff">by '+E(h.nickname)+'</small></span></a>'}).join('')}).catch(function(){none('pu','読み込めなかったょ')});
DB.hpList('rank','','',5).then(function(L){L=L.filter(function(h){return h.claps>0});if(!L.length)return none('rk','拍手を集めてﾗﾝｸｲﾝしよう♪');$('rk').innerHTML=L.map(function(h,i){return '<a class="hrow" href="hp.html?id='+E(h.hp_id)+'"><span class="rk">'+(i+1)+'位</span><span style="flex:1"><b style="color:#ff9ad5">'+E(h.title||h.nickname)+'</b></span><small>👏'+h.claps+'</small></a>'}).join('')}).catch(function(){none('rk','読み込めなかったょ')});
DB.posts(4).then(function(L){if(!L.length)return none('bbs','まだ書き込みがないょ');$('bbs').innerHTML=L.map(function(p){return '<div class="drow"><b>'+E(p.profiles?p.profiles.nickname:'ななしさん')+'</b> <small style="display:inline">'+tm(p.created_at)+'</small><br>'+E(p.body).slice(0,80)+'</div>'}).join('')}).catch(function(){none('bbs','読み込めなかったょ')});
DB.materials(6).then(function(L){if(!L.length)return none('sz','まだ素材がないょ');$('sz').innerHTML=L.map(function(m){return '<a href="sozai.html" title="'+E(m.title)+'"><img src="'+E(DB.sozBase+m.path)+'" alt="'+E(m.title||'素材')+'"></a>'}).join('')}).catch(function(){none('sz','読み込めなかったょ')});
/* tap sparkle */
var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(still)return;
var cv=$('kira'),cx=cv.getContext('2d'),W,H,P=[],G=[],C=['#ff2d95','#ffffff','#ff7fc4','#e0e0ee','#ffd6ec','#c0c0d0'];
function sz(){var d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}sz();addEventListener('resize',sz);
function st(x,y,r,a,c){cx.globalAlpha=a;cx.fillStyle=c;cx.beginPath();cx.moveTo(x,y-r);cx.quadraticCurveTo(x,y,x+r,y);cx.quadraticCurveTo(x,y,x,y+r);cx.quadraticCurveTo(x,y,x-r,y);cx.quadraticCurveTo(x,y,x,y-r);cx.fill()}
function hs(x,y,r,a,c){cx.globalAlpha=a;cx.fillStyle=c;cx.beginPath();cx.moveTo(x,y+r*.9);cx.bezierCurveTo(x-r*1.4,y-r*.1,x-r*.6,y-r*1.1,x,y-r*.35);cx.bezierCurveTo(x+r*.6,y-r*1.1,x+r*1.4,y-r*.1,x,y+r*.9);cx.fill()}
var run=false;function loop(){cx.clearRect(0,0,W,H);
  for(var j=G.length-1;j>=0;j--){var g=G[j];g.r+=g.v;g.v*=.93;g.l-=.035;if(g.l<=0){G.splice(j,1);continue}cx.globalAlpha=g.l;cx.strokeStyle=g.c;cx.lineWidth=2.5*g.l+.5;cx.beginPath();cx.arc(g.x,g.y,g.r,0,6.283);cx.stroke()}
  for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy=p.vy*.97+.08;p.l-=p.d;if(p.l<=0){P.splice(i,1);continue}(p.h?hs:st)(p.x,p.y,p.r*p.l+1.5,Math.min(1,p.l*1.4),p.c)}
  cx.globalAlpha=1;if(P.length||G.length)requestAnimationFrame(loop);else run=false}
addEventListener('pointerdown',function(e){var n=24+Math.floor(Math.random()*10);for(var i=0;i<n;i++){var a=Math.random()*6.283,v=1+Math.random()*7;P.push({x:e.clientX,y:e.clientY,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,r:i<5?7+Math.random()*5:2+Math.random()*5,l:1,d:.014+Math.random()*.014,c:C[Math.floor(Math.random()*C.length)],h:Math.random()<.3})}
  G.push({x:e.clientX,y:e.clientY,r:4,v:7,l:1,c:'#ff2d95'});if(!run){run=true;requestAnimationFrame(loop)}});
})();
