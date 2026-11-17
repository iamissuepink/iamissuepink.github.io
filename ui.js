/* めろﾋﾟｮﾝ☆ 確認・お知らせ画面（ブラウザの confirm/alert/prompt の代わり）
   ブラウザによってゎ確認ダイアログが勝手に閉じられたり「このﾍﾟｰｼﾞのダイアログを表示しない」にされると
   ボタンが無反応になるので、ﾍﾟｰｼﾞの中に自前で出す */
(function(){
var css='.uim{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:16px}'+
'.uib{background:#0d0008;color:#ffd6ec;border:3px double #ff5fb8;box-shadow:0 0 0 2px #000,0 0 18px rgba(255,95,184,.55);max-width:360px;width:100%;padding:16px 14px 12px;font:14px/1.7 "MS PGothic","ＭＳ Ｐゴシック","Hiragino Kaku Gothic ProN",sans-serif;text-align:center}'+
'.uib p{margin:0 0 12px;white-space:pre-wrap;word-break:break-word}'+
'.uib input{width:100%;box-sizing:border-box;font-size:16px;padding:6px;margin:0 0 12px;background:#1a0010;color:#ffd6ec;border:2px inset #ff9ad5}'+
'.uib .uirow{display:flex;gap:8px;justify-content:center}'+
'.uib button{min-width:96px;min-height:38px;font:bold 14px/1 inherit;font-family:inherit;color:#fff;background:linear-gradient(#ff7cc6,#d6197f);border:2px outset #ffb3d9;cursor:pointer;padding:6px 12px}'+
'.uib button.no{background:linear-gradient(#5a5a5a,#2a2a2a);border-color:#888}'+
'.uib button:active{border-style:inset}';
var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var q=Promise.resolve();
function open(kind,text,def){
  var run=function(){return new Promise(function(res){
    var prev=document.activeElement,w=document.createElement('div');w.className='uim';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');
    w.innerHTML='<div class="uib"><p>'+esc(text)+'</p>'+(kind==='input'?'<input type="text" value="'+esc(def||'')+'">':'')+
      '<div class="uirow">'+(kind==='tell'?'':'<button type="button" class="no">やめる</button>')+'<button type="button" class="ok">'+(kind==='tell'?'OK':'OK♪')+'</button></div></div>';
    document.body.appendChild(w);
    var inp=w.querySelector('input'),ok=w.querySelector('.ok'),no=w.querySelector('.no');
    function done(v){document.removeEventListener('keydown',key,true);w.remove();try{prev&&prev.focus&&prev.focus()}catch(e){}res(v)}
    function key(e){if(e.key==='Escape'){e.preventDefault();done(kind==='tell'?undefined:kind==='input'?null:false)}
      else if(e.key==='Enter'&&(!inp||document.activeElement===inp)){e.preventDefault();ok.click()}}
    document.addEventListener('keydown',key,true);
    ok.onclick=function(){done(kind==='input'?inp.value:kind==='ask'?true:undefined)};
    if(no)no.onclick=function(){done(kind==='input'?null:false)};
    w.addEventListener('click',function(e){if(e.target===w&&kind!=='tell')done(kind==='input'?null:false)});
    setTimeout(function(){(inp||ok).focus();if(inp)inp.select()},0);
  })};
  var p=q.then(run);q=p.catch(function(){});return p}
window.UI={
  ask:function(t){return open('ask',t)},       // → true / false
  tell:function(t){return open('tell',t)},     // → (OKで閉じる)
  input:function(t,d){return open('input',t,d)} // → 文字 / null
};
})();
