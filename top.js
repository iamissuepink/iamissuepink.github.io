(function(){
var $=function(i){return document.getElementById(i)},E=DB.esc;
function tm(s){var d=new Date(s);return (d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function isNew(s){return Date.now()-new Date(s).getTime()<3*86400000}
function ic(h){return h.icon&&h.icon.indexOf(DB.imgBase)===0?'<img src="'+E(h.icon)+'" alt="">':'<span class="ni">♡</span>'}
/* tags */
function safe(f){try{f()}catch(e){if(window.console)console.warn(e)}}
safe(function(){var TC=DB.TAGCATS||{'タグ':DB.TAGS||[]};
$('cats').innerHTML=Object.keys(TC).map(function(c){return '<div><b>■'+E(c)+'</b>'+TC[c].map(function(t){return '<a href="search.html?tag='+encodeURIComponent(t)+'">'+E(t)+'</a>'}).join('/ ')+'</div>'}).join('');
});
safe(function(){$('catmore').onclick=function(){var c=$('cats');c.classList.toggle('fold');this.textContent=c.classList.contains('fold')?'▼ カテゴリをもっと見る':'▲ たたむ'};
});
safe(function(){$('rl').onclick=async function(){try{var id=await DB.randomHp();if(id)location.href='hp.html?id='+id;else UI.tell('まだﾎﾑﾍﾟがないみたい')}catch(e){UI.tell(e.message)}};
});
/* signs */
safe(function(){if(!$('signs'))return;
var S=['おひつじ','おうし','ふたご','かに','しし','おとめ','てんびん','さそり','いて','やぎ','みずがめ','うお'],M=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
$('signs').innerHTML=S.map(function(s,i){return '<a href="fortune.html?s='+i+'"><span>'+M[i]+'</span>'+s+'</a>'}).join('');
});
/* BBS本文：[s=素材ｺｰﾄﾞ] を画像にする（max があれば文字数で切る。画像ゎ文字数に数えない） */
function bbsHtml(t,max){var s=String(t==null?'':t),out='',n=0,re=/\[s=([^\]\s]+)\]/g,last=0,m;
  function txt(x){if(max!=null)x=x.slice(0,Math.max(0,max-n));n+=x.length;return E(x)}
  while((m=re.exec(s))){out+=txt(s.slice(last,m.index));last=re.lastIndex;if(DB.sozOk(m[1]))out+='<img src="'+E(DB.sozUrl(m[1]))+'" alt="" style="vertical-align:middle;max-width:100%">'}
  return out+txt(s.slice(last))}
/* live data */
var none=function(id,t){$(id).innerHTML='<p class="msg">'+t+'</p>'};
DB.newDiaries(5).then(function(L){if(!L.length)return none('nd','まだ日記がないょ');$('nd').innerHTML=L.map(function(d){return '<a class="drow" href="hp.html?id='+E(d.hp_id)+'#diary"><b>'+E(d.title||'無題')+'</b>'+(isNew(d.created_at)?'<span class="new">NEW!</span>':'')+'<small>'+tm(d.created_at)+' by '+E(d.nickname)+'</small></a>'}).join('')}).catch(function(){none('nd','読み込めなかったょ')});
DB.hpList('pickup','','',5).then(function(L){if(!L.length)return none('pu','まだﾎﾑﾍﾟがないょ');$('pu').innerHTML=L.map(function(h){return '<a class="hrow" href="hp.html?id='+E(h.hp_id)+'">'+ic(h)+'<span><b style="color:#ff9ad5">'+E(h.title||h.nickname)+'</b><br><small style="color:#c9a2ff">by '+E(h.nickname)+'</small></span></a>'}).join('')}).catch(function(){none('pu','読み込めなかったょ')});
DB.hpList('rank','','',5).then(function(L){L=L.filter(function(h){return h.claps>0});if(!L.length)return none('rk','拍手を集めてﾗﾝｸｲﾝしよう♪');$('rk').innerHTML=L.map(function(h,i){return '<a class="hrow" href="hp.html?id='+E(h.hp_id)+'"><span class="rk">'+(i+1)+'位</span><span style="flex:1"><b style="color:#ff9ad5">'+E(h.title||h.nickname)+'</b></span><small>👏'+h.claps+'</small></a>'}).join('')}).catch(function(){none('rk','読み込めなかったょ')});
DB.posts(4).then(function(L){if(!L.length)return none('bbs','まだ書き込みがないょ');$('bbs').innerHTML=L.map(function(p){return '<div class="drow"><b>'+E(p.profiles?p.profiles.nickname:'ななしさん')+'</b> <small style="display:inline">'+tm(p.created_at)+'</small><br>'+bbsHtml(p.body,80)+'</div>'}).join('')}).catch(function(){none('bbs','読み込めなかったょ')});
DB.materials(6).catch(function(){return []}).then(function(L){L=L.slice(0,6);if(L.length<6)L=L.concat(DB.OFFICIAL.map(function(o){return {path:o[0],title:o[1]}}).slice(0,6-L.length));if(!L.length)return none('sz','まだ素材がないょ');$('sz').innerHTML=L.map(function(m){return '<a href="sozai.html" title="'+E(m.title)+'"><img src="'+E(DB.sozUrl(m.path))+'" alt="'+E(m.title||'素材')+'"></a>'}).join('')}).catch(function(){none('sz','読み込めなかったょ')});
})();
