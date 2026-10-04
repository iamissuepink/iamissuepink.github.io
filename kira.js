(function(){
var root=document.getElementById('root');
var esc=function(t){return t};
function rnd(n){var x=Math.sin(n*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
function deco(){
  var H=root.scrollHeight,h='';
  var G=['✦','✧','★','✶','･','✦','☆'],C=['#ffffff','#ffffff','#ff9ad5','#ffe066','#9be3ff','#c9a2ff'];
  var n=Math.round(110*H/3640);
  for(var i=0;i<n;i++){var fast=rnd(i+5)>0.45;
    h+='<span class="tw '+(fast?'b':'a')+'" style="left:'+Math.round(rnd(i+1)*384)+'px;top:'+Math.round(rnd(i+2)*(H-40))+'px;font-size:'+Math.round(6+Math.pow(rnd(i+3),2)*24)+'px;color:'+C[Math.floor(rnd(i+4)*C.length)]+';animation-duration:'+(fast?(0.4+rnd(i+6)*0.9):(1+rnd(i+6)*1.6)).toFixed(2)+'s;animation-delay:'+(rnd(i+7)*2).toFixed(2)+'s">'+G[Math.floor(rnd(i+11)*G.length)]+'</span>'}
  var F=['#ff4fa3','#b77bff','#ff8fc8'],heart=function(f,st){return '<svg class="hc" style="'+st+'" width="20" height="19" viewBox="0 0 30 28" aria-hidden="true"><path d="M15 26 C2 17 1 4 8 3 C12 2 15 6 15 8 C15 6 18 2 22 3 C29 4 28 17 15 26 Z" fill="'+f+'" stroke="#ffffff" stroke-width="1.5"></path></svg>'};
  for(var y=40,j=0;y<H-40;y+=96,j++){h+=heart(F[j%3],'left:'+(j%2?1:3)+'px;top:'+y+'px;animation-delay:'+((j%4)*0.2)+'s');h+=heart(F[(j+1)%3],'left:'+(j%2?369:367)+'px;top:'+(y+48)+'px;animation-delay:'+((j%3)*0.25)+'s')}
  var d=document.createElement('div');d.setAttribute('aria-hidden','true');d.innerHTML=h;root.insertBefore(d,root.firstChild);
}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(deco);else window.addEventListener('load',deco);
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
root.addEventListener('pointerdown',function(e){
  if(reduce)return;
  var r=root.getBoundingClientRect(),k=r.width?root.offsetWidth/r.width:1;
  var x=Math.round((e.clientX-r.left)*k),y=Math.round((e.clientY-r.top)*k);
  var G=['✦','✧','★','☆','♡','✶','･','✦','✧'],C=['#ffffff','#ff7ac1','#ffe066','#9be3ff','#c9a2ff','#5ff08f','#ff4fa3','#ffffff'];
  var b=document.createElement('div');b.className='bst';b.style.left=x+'px';b.style.top=y+'px';
  var h='<span class="rg"></span>',n=18+Math.floor(Math.random()*12);
  for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,d=20+Math.random()*110,dx=Math.cos(a)*d,dy=Math.sin(a)*d+15+Math.random()*45;
    h+='<span class="sp" style="--dx:'+dx.toFixed(1)+'px;--dy:'+dy.toFixed(1)+'px;--r:'+Math.round(Math.random()*540-270)+'deg;animation-duration:'+(0.55+Math.random()*0.8).toFixed(2)+'s;animation-delay:'+(Math.random()*0.2).toFixed(2)+'s;color:'+C[Math.floor(Math.random()*C.length)]+';font-size:'+Math.round(8+Math.random()*18)+'px"><span class="fl" style="animation-duration:'+(0.05+Math.random()*0.15).toFixed(2)+'s">'+G[Math.floor(Math.random()*G.length)]+'</span></span>'}
  b.innerHTML=h;root.appendChild(b);setTimeout(function(){b.remove()},1600);
});
document.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.getAttribute('href')==='#')e.preventDefault()});
})();
