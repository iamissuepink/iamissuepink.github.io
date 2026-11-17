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
/* 色名：JIS慣用色名・CSSの色名など、よく使われる名前と値。近さゎ人の見え方に近い色差（CIEDE2000）で比べる */
var CNAMES=[
 ['ﾋﾟﾝｸ','#ffc0cb'],['ﾗｲﾄﾋﾟﾝｸ','#ffb6c1'],['ﾍﾞﾋﾞｰﾋﾟﾝｸ','#f9c9d9'],['ﾐﾙｸﾋﾟﾝｸ','#f7d8e0'],['さくら色','#fef4f4'],['桃色','#f09199'],['ﾎｯﾄﾋﾟﾝｸ','#ff69b4'],['ﾃﾞｨｰﾌﾟﾋﾟﾝｸ','#ff1493'],['ﾋﾞﾋﾞｯﾄﾞﾋﾟﾝｸ','#ff3d9a'],['ﾛｰｽﾞ','#e95295'],['ｵｰﾙﾄﾞﾛｰｽﾞ','#e29399'],['ﾏｾﾞﾝﾀﾞ','#e4007f'],['ﾌｭｰｼｬ','#ff00ff'],['ｻｰﾓﾝﾋﾟﾝｸ','#ff91a4'],['ｺｰﾗﾙﾋﾟﾝｸ','#f88379'],['ﾗｽﾞﾍﾞﾘｰ','#b8336a'],
 ['真っ赤','#ff0000'],['赤','#e60033'],['ｸﾘﾑｿﾞﾝ','#dc143c'],['ｽｶｰﾚｯﾄ','#e83929'],['ﾄﾏﾄ','#ff6347'],['ﾜｲﾝﾚｯﾄﾞ','#b33e5c'],['ﾎﾞﾙﾄﾞｰ','#6c2735'],['ｻｰﾓﾝ','#fa8072'],
 ['ｵﾚﾝｼﾞ','#ffa500'],['ﾋﾞﾋﾞｯﾄﾞｵﾚﾝｼﾞ','#ff7f00'],['ﾋﾟｰﾁ','#ffcba4'],['ｱﾌﾟﾘｺｯﾄ','#fbceb1'],['ﾃﾗｺｯﾀ','#e2725b'],
 ['ｷｬﾒﾙ','#c19a6b'],['ﾍﾞｰｼﾞｭ','#eedcb3'],['ﾐﾙｸﾃｨｰ','#d8c2b0'],['ｸﾞﾚｰｼﾞｭ','#c8bfb4'],['ﾓｶ','#9b7b65'],['茶色','#8b4513'],['ｺｺｱ','#7b5544'],['ﾁｮｺﾚｰﾄ','#6c3524'],
 ['ｸﾘｰﾑ','#fffdd0'],['ﾊﾞﾆﾗ','#f3e5ab'],['ﾚﾓﾝｲｴﾛｰ','#fff262'],['黄色','#ffd900'],['ｺﾞｰﾙﾄﾞ','#ffd700'],['金色','#d4af37'],['ﾏｽﾀｰﾄﾞ','#d0af4c'],
 ['ﾗｲﾑｸﾞﾘｰﾝ','#bfff00'],['黄緑','#b8d200'],['若草色','#c3d825'],['抹茶','#c5c56a'],['ｵﾘｰﾌﾞ','#808000'],['ｶｰｷ','#c3b091'],['ﾐﾝﾄ','#a8e6cf'],['ｴﾒﾗﾙﾄﾞ','#50c878'],['緑','#3eb370'],['ﾌｫﾚｽﾄｸﾞﾘｰﾝ','#228b22'],['深緑','#00552e'],
 ['ﾀｰｺｲｽﾞ','#40e0d0'],['ﾃｨｰﾙ','#008080'],['ｱｸｱ','#00ffff'],['ｼｱﾝ','#00a1e9'],['水色','#bce2e8'],['ﾍﾞﾋﾞｰﾌﾞﾙｰ','#bbdbf3'],['ｽｶｲﾌﾞﾙｰ','#87ceeb'],['ﾃﾞｨｰﾌﾟｽｶｲﾌﾞﾙｰ','#00bfff'],['ｻｯｸｽﾌﾞﾙｰ','#4c6cb3'],['青','#0095d9'],['ﾛｲﾔﾙﾌﾞﾙｰ','#4169e1'],['真っ青','#0000ff'],['瑠璃色','#1e50a2'],['紺色','#223a70'],['ﾈｲﾋﾞｰ','#000080'],['ﾐｯﾄﾞﾅｲﾄﾌﾞﾙｰ','#191970'],
 ['ﾍﾟｰﾙﾗﾍﾞﾝﾀﾞｰ','#e6e6fa'],['ﾗﾍﾞﾝﾀﾞｰ','#c8b6e2'],['藤色','#bbbcde'],['ﾗｲﾗｯｸ','#c8a2c8'],['ﾌﾟﾗﾑ','#dda0dd'],['ｵｰｷｯﾄﾞ','#da70d6'],['すみれ色','#7058a3'],['ﾊﾟｰﾌﾟﾙ','#9b72b0'],['紫','#884898'],['ﾌﾞﾄﾞｳ色','#522f60'],
 ['白','#ffffff'],['ｱｲﾎﾞﾘｰ','#f8f4e6'],['ｼﾙﾊﾞｰ','#c0c0c0'],['ﾗｲﾄｸﾞﾚｰ','#d3d3d3'],['ｸﾞﾚｰ','#808080'],['ﾁｬｺｰﾙｸﾞﾚｰ','#4e454a'],['黒','#000000']];
function lab(h){var c=rgb(h);if(!c)return null;var v=c.map(function(x){x/=255;return x>0.04045?Math.pow((x+0.055)/1.055,2.4):x/12.92});
  var X=(v[0]*0.4124+v[1]*0.3576+v[2]*0.1805)/0.95047,Y=v[0]*0.2126+v[1]*0.7152+v[2]*0.0722,Z=(v[0]*0.0193+v[1]*0.1192+v[2]*0.9505)/1.08883;
  function f(t){return t>0.008856?Math.cbrt(t):7.787*t+16/116}var fx=f(X),fy=f(Y),fz=f(Z);return [116*fy-16,500*(fx-fy),200*(fy-fz)]}
function de2000(p,q){var L1=p[0],a1=p[1],b1=p[2],L2=q[0],a2=q[1],b2=q[2],rad=Math.PI/180,deg=180/Math.PI;
  var C1=Math.hypot(a1,b1),C2=Math.hypot(a2,b2),Cb=(C1+C2)/2,G=0.5*(1-Math.sqrt(Math.pow(Cb,7)/(Math.pow(Cb,7)+Math.pow(25,7))));
  var a1p=(1+G)*a1,a2p=(1+G)*a2,C1p=Math.hypot(a1p,b1),C2p=Math.hypot(a2p,b2);
  function hp(a,b){if(!a&&!b)return 0;var h=Math.atan2(b,a)*deg;return h<0?h+360:h}var h1=hp(a1p,b1),h2=hp(a2p,b2);
  var dL=L2-L1,dC=C2p-C1p,dh=0;if(C1p*C2p){dh=h2-h1;if(dh>180)dh-=360;else if(dh<-180)dh+=360}var dH=2*Math.sqrt(C1p*C2p)*Math.sin(dh/2*rad);
  var Lb=(L1+L2)/2,Cbp=(C1p+C2p)/2,hb=h1+h2;if(C1p*C2p){if(Math.abs(h1-h2)>180)hb+=(hb<360?360:-360);hb/=2}
  var T=1-0.17*Math.cos((hb-30)*rad)+0.24*Math.cos(2*hb*rad)+0.32*Math.cos((3*hb+6)*rad)-0.20*Math.cos((4*hb-63)*rad);
  var dth=30*Math.exp(-Math.pow((hb-275)/25,2)),Rc=2*Math.sqrt(Math.pow(Cbp,7)/(Math.pow(Cbp,7)+Math.pow(25,7)));
  var Sl=1+0.015*Math.pow(Lb-50,2)/Math.sqrt(20+Math.pow(Lb-50,2)),Sc=1+0.045*Cbp,Sh=1+0.015*Cbp*T,Rt=-Math.sin(2*dth*rad)*Rc;
  return Math.sqrt(Math.pow(dL/Sl,2)+Math.pow(dC/Sc,2)+Math.pow(dH/Sh,2)+Rt*(dC/Sc)*(dH/Sh))}
/* 近い名前がないときの説明（例：くすんだ青、明るい黄緑、暗いｸﾞﾚｰ） */
function describe(h){var c=rgb(h).map(function(x){return x/255}),mx=Math.max.apply(0,c),mn=Math.min.apply(0,c),l=(mx+mn)/2,d=mx-mn,s=d?d/(1-Math.abs(2*l-1)):0,hu=0;
  if(d){if(mx===c[0])hu=((c[1]-c[2])/d+6)%6;else if(mx===c[1])hu=(c[2]-c[0])/d+2;else hu=(c[0]-c[1])/d+4;hu*=60}
  if(s<0.12||d<0.06)return l>0.93?'白っぽい色':l>0.7?'明るいｸﾞﾚｰ':l>0.4?'ｸﾞﾚｰ':l>0.12?'暗いｸﾞﾚｰ':'黒っぽい色';
  var n=hu<12||hu>=348?'赤':hu<40?'ｵﾚﾝｼﾞ':hu<65?'黄色':hu<95?'黄緑':hu<150?'緑':hu<175?'青緑':hu<200?'水色':hu<245?'青':hu<270?'青紫':hu<300?'紫':hu<330?'赤紫':'ﾋﾟﾝｸ';
  if((n==='赤'||n==='赤紫')&&l>0.68)n='ﾋﾟﾝｸ';if(n==='ｵﾚﾝｼﾞ'&&l<0.4)n='茶色';if(n==='ﾋﾟﾝｸ'&&l<0.35)n='赤紫';if(n==='黄色'&&l<0.35)n='ｵﾘｰﾌﾞ色';
  var pre=l<0.18?'とても暗い':l<0.35?'暗い':l>0.88?'淡い':l>0.72?'明るい':'';if(s<0.35&&l>=0.18&&l<=0.88)pre=pre?pre+'くすんだ':'くすんだ';else if(s>0.85&&l>0.4&&l<0.7)pre='鮮やかな';
  return pre+n}
var CLAB=null;
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
  /* 色名：とても近い→その名前／近い→「○○に近い色」／遠い→「くすんだ青」みたいな説明 */
  colorName:function(h){var p=lab(h);if(!p)return '';if(!CLAB)CLAB=CNAMES.map(function(c){return [c[0],lab(c[1])]});
    var best=null,bd=1e9;CLAB.forEach(function(c){var d=de2000(p,c[1]);if(d<bd){bd=d;best=c[0]}});
    if(bd<=4.5)return best;if(bd<=9)return best+'に近い色';return describe(h)},
  deltaE:function(a,b){return de2000(lab(a),lab(b))}};
})();
