/* めろﾋﾟｮﾝ☆ ﾎﾑﾍﾟの「部品」カタログ（組み合わせ層）
 *
 * ﾎﾑﾍﾟのﾃﾞｻﾞｲﾝ ＝ 骨格 ＋ 背景 ＋ 枠 ＋ 見出し ＋ 配色
 *   骨格 … D.tpl（ﾒﾆｭｰの形や並び順。今までのﾃﾝﾌﾟﾚ9種の「中身の並べ方」）
 *   背景 … D.design.bg     （body の柄）
 *   枠   … D.design.frame  （.screen のまわり）
 *   見出し… D.design.head   （.ttl / .c-h / .c-hb / .tg-h）
 *   配色 … D.design.pal    （6色＋そこから作る補助色）＋ D.colors（自分で変えた色）
 *
 * どの部品も 'auto'＝「ﾃﾝﾌﾟﾚのまま」。'auto' のときゎ今までのﾃﾝﾌﾟﾚの見た目がそのまま出る。
 * → 既存のﾎﾑﾍﾟゎ D.design が無い＝全部 'auto' なので、見た目が変わらない（ﾃﾞｰﾀの書きかえ不要）。
 * 第1層の「完成ﾃﾝﾌﾟﾚ」＝ 骨格だけ決めて、ほかを全部 'auto' にした組み合わせ。
 */
(function(){
var SKEL=[
 ['garake','ｶﾞﾗｹｰ王道','ｹｰﾀｲの枠＋ﾏｽ目ﾒﾆｭｰ','grid',1],
 ['gal','ｷﾞｬﾙ','ﾍｯﾀﾞｰ枠＋帯ﾎﾞﾀﾝ','bars',1],
 ['yume','ゆめかわ','ふんわり2列ﾒﾆｭｰ','pair',1],
 ['jirai','地雷系・量産型','ﾀﾌﾞﾒﾆｭｰ','tabs',1],
 ['pop','ﾎﾟｯﾌﾟ','表のﾒﾆｭｰ','table',0],
 ['street','ｽﾄﾘｰﾄ','ﾘｽﾄﾒﾆｭｰ','list',1],
 ['kr','韓国系','写真が先頭＋ﾀﾌﾞ','tabs',2],
 ['voc','ﾎﾞｶﾛ系','ﾘｽﾄ＋音の線','list',0],
 ['y2k','Y2K・ｻｲﾊﾞｰ','ｱｲｺﾝﾒﾆｭｰ','icons',1]];
var BG=[['dot','水玉'],['dotb','大きい水玉'],['stripe','たてｽﾄﾗｲﾌﾟ'],['border','ﾎﾞｰﾀﾞｰ'],['naname','ななめｽﾄﾗｲﾌﾟ'],['check','ｷﾞﾝｶﾞﾑﾁｪｯｸ'],['tartan','ﾀｰﾀﾝﾁｪｯｸ'],['dia','ｷﾞｻﾞｷﾞｻﾞ'],['heart','ﾊｰﾄ柄'],['star','星柄'],['kira','ｷﾗｷﾗ'],['grid','方眼（ｻｲﾊﾞｰ）'],['cloud','ゆめかわｸﾞﾗﾃﾞ'],['leo','ﾋﾟﾝｸﾋｮｳ柄（画像）'],['plain','無地']];
var FRAME=[['line','1本線'],['double','二重線'],['dot','点線'],['stitch','ｽﾃｯﾁ'],['outset','立体（平成ﾎﾞﾀﾝ風）'],['glow','ｷﾗｷﾗ光る'],['round','ぷっくり角丸'],['dots','水玉ふち'],['win','ｳｨﾝﾄﾞｳ風'],['tape','ﾏｽｷﾝｸﾞﾃｰﾌﾟ'],['none','枠なし']];
var HEAD=[['band','帯'],['ribbon','ﾘﾎﾞﾝ'],['grad','ｸﾞﾗﾃﾞ帯'],['double','上下二重線'],['under','点線の下線'],['line','左の線'],['bubble','ふきだし'],['heart','ﾊｰﾄではさむ'],['star','星ではさむ'],['crown','王冠'],['neon','ﾈｵﾝ'],['win','ｳｨﾝﾄﾞｳ風']];
/* 配色：6色（背景・背景の柄・画面の中・文字・メイン・サブ）。ほかの補助色ゎここから自動で作る */
var PAL=[
 ['pink','ﾋﾟﾝｸ水玉','#ffd6ea','#ffb8d9','#ffffff','#6b1f45','#ff3d9a','#ff8cc6',{sub:'#ffc1df',line:'#ffb3d6',title2:'#ffffff',frame:'#fff0f7'}],
 ['hime','姫ﾊﾟｽﾃﾙ','#fff0f6','#ffd6e8','#fffdf7','#7a3b5c','#ff6fae','#d4a76a'],
 ['ryosan','量産（白×ﾐﾙｸﾋﾟﾝｸ）','#fff5f8','#ffe0ea','#ffffff','#7a4a5a','#f48fb1','#ffd1df'],
 ['sakura','さくら','#fdeef3','#f9d3e0','#ffffff','#6b3a4a','#e8577f','#9ccc65'],
 ['yume','ゆめかわ','#f3e8ff','#ffd9f2','#ffffff','#4a2a6b','#b45cff','#e3a3ff',{sub:'#bfeaff',line:'#dcc4f5',frame:'#fbf5ff',glit:'#ff8fd0,#8fd8ff,#fff27a,#b0ff9e'}],
 ['lavender','ﾗﾍﾞﾝﾀﾞｰ','#efe8ff','#ddd0ff','#ffffff','#4a3a6b','#9b7bff','#ffb3e1'],
 ['mizu','水色','#d4f1ff','#a8e2fb','#ffffff','#164a66','#1ea7e6','#7fd3f5',{sub:'#c4ecfc',line:'#9fd9f3',frame:'#effaff'}],
 ['mint','ﾐﾝﾄﾁｮｺ','#d9f7ee','#b5ecd9','#fffdf9','#4a2e22','#2bb3a0','#7a5240'],
 ['lemon','ﾚﾓﾝ','#fffbd1','#fff08a','#ffffff','#5c4a00','#ff9500','#ffc766',{sub:'#d6f5a8',line:'#f2df70',frame:'#fffde8'}],
 ['pastelpop','ﾊﾟｽﾃﾙﾎﾟｯﾌﾟ','#fff8d6','#ffd1e8','#ffffff','#3a3a3a','#ff6f9f','#6fc8ff'],
 ['pop','原色ﾎﾟｯﾌﾟ','#fff27a','#ff7ab8','#ffffff','#1a1a1a','#ff3d6e','#3db8ff',{sub:'#7cf07c',line:'#1a1a1a',title2:'#000000',glit:'#ff3d6e,#3db8ff,#ffd400,#7cf07c'}],
 ['kr','ﾍﾞｰｼﾞｭ（韓国系）','#f4ede4','#e9dfd2','#fffdf9','#5a4a3f','#b89580','#d8c2b0',{sub:'#efe6dc',line:'#e2d6c8'}],
 ['galpink','黒×ﾋﾟﾝｸ','#000000','#3a0a24','#0b0006','#ffd6ec','#ff2e97','#ffb3d9',{sub:'#5a1b38',line:'#5a1b38',title2:'#000000',frame:'#1a0010'}],
 ['gal','黒×ﾋﾟﾝｸ×ｺﾞｰﾙﾄﾞ','#000000','#24001a','#0b0006','#ffe3f1','#ff2e97','#ff86c4',{sub:'#d4a017',line:'#4a2238',title2:'#000000',frame:'#1a0010',glit:'#ffd700,#ff4fa8,#ffffff'}],
 ['leo','ｷﾞｬﾙ金（ﾋｮｳ柄色）','#c9944a','#2b1500','#0d0805','#ffe9c9','#d4a017','#ffe58a',{sub:'#ff2e97',line:'#5a3a10',title2:'#000000',frame:'#1a0f05',glit:'#ffd700,#fff3b0,#ff4fa8'}],
 ['jirai','地雷（黒×淡ﾋﾟﾝｸ）','#0d0008','#2a0017','#140009','#ffd9ea','#ff6fae','#ffb3d1',{sub:'#3a0020',line:'#5a1b38',title2:'#000000',frame:'#1a000d'}],
 ['choco','ﾁｮｺ×ﾋﾟﾝｸ','#3b241a','#523428','#2a1a12','#ffe6f0','#ff8cc6','#ffd6a8'],
 ['mono_red','ﾓﾉｸﾛ×赤','#f2f2f2','#dcdcdc','#ffffff','#1a1a1a','#e60033','#444444'],
 ['mono_pink','ﾓﾉｸﾛ×ﾋﾟﾝｸ','#111111','#2a2a2a','#000000','#f2f2f2','#ff3d9a','#888888'],
 ['street','ｽﾄﾘｰﾄ（黒×ﾗｲﾑ）','#2b2b2e','#3a3a3e','#18181a','#f2f2f2','#c6ff1a','#ff3dc5',{sub:'#ffd400',line:'#444444',title2:'#000000'}],
 ['voc','ﾎﾞｶﾛ（紺×ｼｱﾝ）','#070a1a','#0f1640','#0a0e24','#d9f7ff','#28e0ff','#ff3dd4',{sub:'#12204f',line:'#1d2c66',title2:'#000000'}],
 ['cyberpk','ﾈｵﾝ（黒×ﾋﾟﾝｸ×水色）','#0a0010','#2a0a3a','#0d0418','#f0e6ff','#ff3dd4','#28e0ff'],
 ['y2k','ｻｲﾊﾞｰｼﾙﾊﾞｰ','#c9d4e6','#e6ecf5','#f4f7fc','#26304a','#3d6bff','#ff6fd0',{sub:'#dfe6f2',line:'#9aa8c2',frame:'#e6ecf5'}]];
/* 系統：選ぶと全部の部品に初期ｾｯﾄが入る。そのあと部品ごとに差しかえOK */
var KEI=[
 ['keitai','ｹｰﾀｲ王道系','平成のｹｰﾀｲﾎﾑﾍﾟそのもの',{skel:'garake',bg:'dot',frame:'double',head:'band',pal:'pink'}],
 ['hime','姫ﾊﾟｽﾃﾙ系','ﾘﾎﾞﾝと水玉でお姫さま',{skel:'yume',bg:'dotb',frame:'dots',head:'ribbon',pal:'hime'}],
 ['gal','ｷﾞｬﾙ系','黒×ﾋﾟﾝｸ×ﾋｮｳ柄で強め',{skel:'gal',bg:'leo',frame:'glow',head:'crown',pal:'galpink'}],
 ['pop','原色ﾎﾟｯﾌﾟ系','元気いっぱいｶﾗﾌﾙ',{skel:'pop',bg:'check',frame:'round',head:'star',pal:'pastelpop'}],
 ['mono','ﾓﾉｸﾛ＋差し色系','白黒に1色だけ効かせる',{skel:'street',bg:'naname',frame:'line',head:'under',pal:'mono_red'}],
 ['yume','ゆめかわ系','ふわふわ夢色',{skel:'yume',bg:'cloud',frame:'glow',head:'bubble',pal:'yume'}],
 ['jirai','地雷・量産系','ﾊｰﾄと黒ﾋﾟﾝｸ',{skel:'jirai',bg:'heart',frame:'double',head:'heart',pal:'jirai'}],
 ['cyber','ｻｲﾊﾞｰ・Y2K系','ｳｨﾝﾄﾞｳと方眼',{skel:'y2k',bg:'grid',frame:'win',head:'win',pal:'y2k'}],
 ['natural','ﾅﾁｭﾗﾙ韓国系','くすみ色でおしゃれ',{skel:'kr',bg:'stripe',frame:'line',head:'line',pal:'kr'}]];
var CNAMES=[['ﾎｯﾄﾋﾟﾝｸ','#ff3d9a'],['ﾍﾞﾋﾞｰﾋﾟﾝｸ','#ffc1df'],['さくら色','#fde2ec'],['ﾛｰｽﾞ','#e8577f'],['ｺｰﾗﾙﾋﾟﾝｸ','#ff7f7f'],['ﾏｾﾞﾝﾀﾞ','#e4007f'],['ﾌｭｰｼｬ','#ff3dd4'],['赤','#e60033'],['ﾜｲﾝﾚｯﾄﾞ','#8b1a3a'],['ｵﾚﾝｼﾞ','#ff8c1a'],['ﾋﾟｰﾁ','#ffcba4'],['ﾚﾓﾝｲｴﾛｰ','#fff27a'],['ｸﾘｰﾑ','#fff6d5'],['金色','#d4a017'],['ﾗｲﾑ','#c6ff1a'],['ﾐﾝﾄ','#9ff0d0'],['ｴﾒﾗﾙﾄﾞ','#2bb673'],['若草色','#9ccc65'],['ﾀｰｺｲｽﾞ','#2bb3a0'],['ｼｱﾝ','#28e0ff'],['水色','#9be3ff'],['ｽｶｲﾌﾞﾙｰ','#1ea7e6'],['ﾛｲﾔﾙﾌﾞﾙｰ','#3d6bff'],['紺','#1a2a6c'],['ﾐｯﾄﾞﾅｲﾄ','#070a1a'],['ﾗﾍﾞﾝﾀﾞｰ','#d6c2ff'],['ﾗｲﾗｯｸ','#c8a2c8'],['紫','#9b4dff'],['ﾌﾞﾄﾞｳ','#5c2a6b'],['ﾍﾞｰｼﾞｭ','#efe2d0'],['ﾐﾙｸﾃｨｰ','#d8c2b0'],['ﾓｶ','#8a6a55'],['ﾁｮｺ','#4a2e22'],['ｱｲﾎﾞﾘｰ','#fffaf0'],['白','#ffffff'],['ｼﾙﾊﾞｰ','#c9d4e6'],['ｸﾞﾚｰ','#8c8c8c'],['ﾁｬｺｰﾙ','#3a3a3e'],['黒','#000000'],['黒ﾋﾟﾝｸ','#2a0618'],['ｷｬﾒﾙ','#c9944a']];
function rgb(h){h=String(h||'').replace('#','');if(h.length!==6)return null;return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function hx(a){return '#'+a.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return ('0'+v.toString(16)).slice(-2)}).join('')}
function mix(a,b,t){var x=rgb(a),y=rgb(b);if(!x||!y)return a;return hx([0,1,2].map(function(i){return x[i]*(1-t)+y[i]*t}))}
function palVars(p){var c={bg:p[2],pat:p[3],card:p[4],ink:p[5],hi:p[6],hi2:p[7]},o=p[8]||{};
  c.sub=o.sub||mix(p[7],p[4],.45);c.line=o.line||mix(p[6],p[4],.55);c.title2=o.title2||p[4];c.frame=o.frame||mix(p[4],p[2],.35);c.glit=o.glit||(p[6]+','+p[7]+',#ffffff');return c}
function find(L,id){for(var i=0;i<L.length;i++)if(L[i][0]===id)return L[i];return null}
window.PARTS={SKEL:SKEL,BG:BG,FRAME:FRAME,HEAD:HEAD,PAL:PAL,KEI:KEI,
  CATS:[['kei','系統'],['skel','骨格'],['bg','背景'],['frame','枠'],['head','見出し'],['pal','配色']],
  VARS:['bg','pat','card','ink','hi','hi2','sub','line','title2','frame','glit'],
  find:find,mix:mix,
  pal:function(id){var p=find(PAL,id);return p?palVars(p):null},
  /* 古いﾃﾞｰﾀにも新しいﾃﾞｰﾀにも使える形にそろえる（知らない値ゎ 'auto'） */
  norm:function(g){g=g&&typeof g==='object'?g:{};var o={};
    o.bg=find(BG,g.bg)?g.bg:'auto';o.frame=find(FRAME,g.frame)?g.frame:'auto';o.head=find(HEAD,g.head)?g.head:'auto';o.pal=find(PAL,g.pal)?g.pal:'auto';o.kei=find(KEI,g.kei)?g.kei:'';return o},
  colorName:function(h){var x=rgb(h);if(!x)return '';var best='',bd=1e9;CNAMES.forEach(function(c){var y=rgb(c[1]),d=(x[0]-y[0])*(x[0]-y[0])*.3+(x[1]-y[1])*(x[1]-y[1])*.59+(x[2]-y[2])*(x[2]-y[2])*.11;if(d<bd){bd=d;best=c[0]}});return (bd<300?'':'〜')+best}};
})();
