(function(){
var $=function(i){return document.getElementById(i)};
function safe(f){try{f()}catch(e){if(window.console)console.warn(e)}}
/* QR */
safe(function(){if(window.QRCode&&$('qr'))new QRCode($('qr'),{text:location.origin+'/',width:86,height:86,colorDark:'#c8005f',colorLight:'#ffffff'})});
/* ﾛｸﾞｲﾝBOX */
safe(function(){if(!$('loginbox')||!window.DB)return;
  async function who(){var u=await DB.me();if(!u)return;
    $('lb-out').hidden=true;$('lb-in').hidden=false;if($('regbtn'))$('regbtn').hidden=true;
    try{var p=await DB.getProfile(u.id);$('wname').textContent=p?p.nickname:'ななし'}catch(e){}
    try{var id=await DB.myHpId(u.id);if(id)$('hpe').href='hp.html?id='+id+'&edit=1'}catch(e){}}
  $('lgo').onclick=async function(){var b=this,m=$('lmsg');b.disabled=true;m.textContent='ﾛｸﾞｲﾝ中…';
    try{await DB.logIn($('lm').value.trim(),$('lp').value);m.textContent='';location.reload()}catch(e){m.textContent=e.message}b.disabled=false};
  $('lp').onkeydown=function(e){if(e.key==='Enter')$('lgo').click()};
  $('lout').onclick=async function(){await DB.logOut();location.href='index.html'};
  who().catch(function(){})});
/* めろID一発ｱｸｾｽ */
safe(function(){if(!$('qid'))return;function go(){var v=$('qid').value.trim().toLowerCase();if(/^[a-z0-9_]{3,16}$/.test(v))location.href='hp.html?id='+v;else alert('めろIDゎ半角英小文字・数字・_ の3〜16文字だょ')}
  $('qgo').onclick=go;$('qid').onkeydown=function(e){if(e.key==='Enter')go()}});
/* キラキラ（背景のまたたき＋タップでピカッ） */
var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var sky=$('sky'),kc=$('kira');if(!sky||!kc)return;
var sx=sky.getContext('2d'),cx=kc.getContext('2d'),W=0,H=0,D=1,STARS=[],P=[],G=[],SHOOT=[];
var COL=['#ffffff','#ffffff','#ff9ad5','#ff4fa3','#e6e6f0','#ffd6ec','#d0d0e0'],VIV=['#ff2d95','#ffffff','#ff7fc4','#ffd6ec','#e0e0ee','#ffe066'];
function size(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;[sky,kc].forEach(function(c){c.width=W*D;c.height=H*D});sx.setTransform(D,0,0,D,0,0);cx.setTransform(D,0,0,D,0,0);
  STARS=[];var n=Math.round(Math.min(180,W*H/5200));for(var i=0;i<n;i++){var big=Math.random()<.18;STARS.push({x:Math.random()*W,y:Math.random()*H,r:big?3+Math.random()*7:.6+Math.random()*1.8,big:big,p:Math.random()*6.28,s:.5+Math.random()*2.6,c:COL[Math.floor(Math.random()*COL.length)],h:big&&Math.random()<.25,fl:Math.random()<.3})}}
function star(c,x,y,r,a,col){c.globalAlpha=a;c.fillStyle=col;c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x,y,x+r,y);c.quadraticCurveTo(x,y,x,y+r);c.quadraticCurveTo(x,y,x-r,y);c.quadraticCurveTo(x,y,x,y-r);c.fill()}
function heart(c,x,y,r,a,col){c.globalAlpha=a;c.fillStyle=col;c.beginPath();c.moveTo(x,y+r*.9);c.bezierCurveTo(x-r*1.4,y-r*.1,x-r*.6,y-r*1.1,x,y-r*.35);c.bezierCurveTo(x+r*.6,y-r*1.1,x+r*1.4,y-r*.1,x,y+r*.9);c.fill()}
function dot(c,x,y,r,a,col){c.globalAlpha=a;c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,6.283);c.fill()}
function drawSky(t){sx.clearRect(0,0,W,H);
  STARS.forEach(function(s){var a=s.fl?(Math.sin(t/1000*s.s*3+s.p)>.2?1:.15):(.5+.5*Math.sin(t/1000*s.s+s.p));
    if(s.big){(s.h?heart:star)(sx,s.x,s.y,s.r*(.45+a*.55),.25+a*.75,s.c);if(a>.8)dot(sx,s.x,s.y,1.2,1,'#fff')}else dot(sx,s.x,s.y,s.r,.2+a*.8,s.c)});
  if(Math.random()<.004&&SHOOT.length<2)SHOOT.push({x:Math.random()*W,y:Math.random()*H*.5,l:1});
  for(var i=SHOOT.length-1;i>=0;i--){var m=SHOOT[i];m.x+=9;m.y+=4.5;m.l-=.02;if(m.l<=0){SHOOT.splice(i,1);continue}
    var g=sx.createLinearGradient(m.x-90,m.y-45,m.x,m.y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,214,236,'+m.l+')');sx.globalAlpha=1;sx.strokeStyle=g;sx.lineWidth=2;sx.beginPath();sx.moveTo(m.x-90,m.y-45);sx.lineTo(m.x,m.y);sx.stroke();star(sx,m.x,m.y,4,m.l,'#fff')}
  sx.globalAlpha=1}
function drawBurst(){cx.clearRect(0,0,W,H);
  for(var j=G.length-1;j>=0;j--){var g=G[j];g.r+=g.v;g.v*=.93;g.l-=.035;if(g.l<=0){G.splice(j,1);continue}cx.globalAlpha=g.l;cx.strokeStyle=g.c;cx.lineWidth=2.5*g.l+.5;cx.beginPath();cx.arc(g.x,g.y,g.r,0,6.283);cx.stroke()}
  for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy=p.vy*.97+p.g;p.l-=p.d;if(p.l<=0){P.splice(i,1);continue}
    var tw=p.tw?(.55+.45*Math.sin(performance.now()/60+p.ph)):1;(p.h?heart:star)(cx,p.x,p.y,(p.r*p.l+1.5)*tw,Math.min(1,p.l*1.4),p.c)}
  cx.globalAlpha=1}
function loop(t){if(!still)drawSky(t);drawBurst();if(!document.hidden)requestAnimationFrame(loop)}
size();addEventListener('resize',size);if(still)drawSky(0);
document.addEventListener('visibilitychange',function(){if(!document.hidden)requestAnimationFrame(loop)});
addEventListener('pointerdown',function(e){if(still)return;var x=e.clientX,y=e.clientY,n=26+Math.floor(Math.random()*12);
  for(var i=0;i<n;i++){var a=Math.random()*6.283,v=1+Math.random()*(i<6?8:5);P.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.2,g:.06+Math.random()*.08,r:i<6?7+Math.random()*6:2+Math.random()*5,l:1,d:.012+Math.random()*.014,c:VIV[Math.floor(Math.random()*VIV.length)],tw:Math.random()<.6,ph:Math.random()*6,h:Math.random()<.3})}
  G.push({x:x,y:y,r:4,v:7,l:1,c:'#ff2d95'});G.push({x:x,y:y,r:2,v:4.5,l:.8,c:'#fff'});if(P.length>400)P.splice(0,P.length-400)},{passive:true});
requestAnimationFrame(loop);
})();
