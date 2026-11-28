/* ============ invitaciones web completas (de tus diseños) ============ */
const WEBS=[
 {id:'w-bautismo-i-celeste',ev:'Bautismo',name:'Bautismo I · celeste',dir:'bautismo-i',pal:'cielo',pair:'bau-paloma-celeste',cover:'bautismo-i.jpg',fill:'bautismo'},
 {id:'w-bautismo-i-rosa',ev:'Bautismo',name:'Bautismo I · rosa',dir:'bautismo-i',pal:'rosa',pair:'bau-paloma-rosa',cover:'bautismo-i-rosa.jpg',fill:'bautismo'},
 {id:'w-bautismo-i-verde',ev:'Bautismo',name:'Bautismo I · verde',dir:'bautismo-i',pal:'verde',pair:'bau-paloma-verde',cover:'bautismo-i-verde.jpg',fill:'bautismo'},
 {id:'w-bautismo-i-lila',ev:'Bautismo',name:'Bautismo I · lila',dir:'bautismo-i',pal:'lavanda',pair:'bau-paloma-lila',cover:'bautismo-i-lila.jpg',fill:'bautismo'},
 {id:'w-bodas-saten',ev:'Bodas',name:'Satén',dir:'bodas-saten',pair:'boda-saten',cover:'bodas-saten.jpg',fill:'saten'},
 {id:'w-xv-holografica',ev:'15 años',name:'XV Holográfica',dir:'xv-holografica',pair:'xv-holo',cover:'t-xv-holo.jpg',fill:'holo'},
 {id:'w-xv-medianoche',ev:'15 años',name:'XV Medianoche',dir:'xv-medianoche',pair:'xv-medianoche',cover:'xv-medianoche.jpg',fill:'xv'},
 {id:'w-baby-ii',ev:'Baby shower',name:'Baby shower II',dir:'baby-shower-ii',pair:'baby-arcoiris',cover:'baby-shower-ii.jpg',fill:'baby'},
 {id:'w-baby-iii',ev:'Baby shower',name:'Baby shower III',dir:'baby-shower-iii',pair:'baby-globo',cover:'baby-shower-iii.jpg',fill:'baby'},
 {id:'w-baby-iv',ev:'Baby shower',name:'Baby shower IV',dir:'baby-shower-iv',pair:'baby-telon',cover:'baby-shower-iv.jpg',fill:'baby'},
 {id:'w-inf-bloques',ev:'Infantiles',name:'Infantiles I · Bloques',dir:'infantiles-i-bloques',pair:'web-bloques',cover:'infantiles-i-bloques.jpg',fill:'bloques'},
 {id:'w-inf-pixeles',ev:'Infantiles',name:'Infantiles II · Pixeles',dir:'infantiles-ii-pixeles',pair:'web-pixeles',cover:'infantiles-ii-pixeles.jpg',fill:'pixeles'},
 {id:'w-inf-autos',ev:'Infantiles',name:'Infantiles III · Autos de carrera',dir:'infantiles-iii-autos',pair:'web-autos',cover:'infantiles-iii-autos.jpg',fill:'autos'},
 {id:'w-inf-sheriff',ev:'Infantiles',name:'Infantiles IV · Sheriff',dir:'infantiles-iv-sheriff',pair:'web-sheriff',cover:'infantiles-iv-sheriff.jpg',fill:'sheriff'},
 {id:'w-inf-estrellas',ev:'Infantiles',name:'Infantiles V · Estrellas',dir:'infantiles-v-estrellas',pair:'web-estrellas',cover:'infantiles-v-estrellas.jpg',fill:'estrellas'},
];
const WEB_BASE='../demos/',WEB_IMG='../img/';
const webById=id=>WEBS.find(w=>w.id===id);
const webCover=w=>(window.WEB_COVERS&&WEB_COVERS[w.cover])||WEB_IMG+w.cover;
const jsq=s=>JSON.stringify(String(s==null?'':s)).replace(/</g,'\\u003c');
const hesc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function wDate(d){const f=parseDate(d.fecha);return f?{f,dia:DIAS[f.getDay()],n:f.getDate(),mes:MESES[f.getMonth()],mm:String(f.getMonth()+1).padStart(2,'0'),dd:String(f.getDate()).padStart(2,'0'),y:f.getFullYear()}:null}
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
function splitPadres(txt){const out={padres:'',padrinos:'',otros:[]};String(txt||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(l=>{const v=l.replace(/^[^:]{0,30}:\s*/,'');if(/padrin/i.test(l))out.padrinos=v;else if(/pap|padres|mam/i.test(l))out.padres=v;else out.otros.push(l)});if(!out.padres&&out.otros.length)out.padres=out.otros.shift().replace(/^[^:]{0,30}:\s*/,'');return out}
/* inserta código justo después de un objeto "var X={...};" (llaves balanceadas) */
function afterObj(h,start,code){const i=h.indexOf(start);if(i<0)return h;let j=h.indexOf('{',i),dep=0,k=j,q=null;for(;k<h.length;k++){const c=h[k];if(q){if(c==='\\'){k++;continue}if(c===q)q=null;continue}if(c==='"'||c==="'")q=c;else if(c==='{')dep++;else if(c==='}'){dep--;if(!dep)break}}let e=k+1;while(h[e]===')'||h[e]===' ')e++;if(h[e]===';')e++;return h.slice(0,e)+'\n'+code+'\n'+h.slice(e)}
/* datos comunes de las webs infantiles */
function infD(d){const D=wDate(d);const ini=d.hora||'16:00';const [hh,mm]=ini.split(':').map(Number);const fin=String(Math.min(23,(hh||0)+3)).padStart(2,'0')+':'+String(mm||0).padStart(2,'0');
  const edad=(String(d.numero||'').match(/\d+/)||[''])[0];return {D,ini,fin,edad,nom:d.nombre||'',lugar:d.lugar||'',dir:d.direccion||'',mapa:[d.lugar,d.direccion].filter(Boolean).join(', '),wa:d.wa||'',alias:d.alias||'',dress:d.dress||''}}
const J=o=>JSON.stringify(o).replace(/</g,'\\u003c');
/* las demos infantiles toman sus datos de window.__C (si está) y si no de var C */
function setC(h,o){return h.includes('window.__C=')?afterObj(h,'window.__C=','Object.assign(window.__C,'+J(o)+');'):afterObj(h,'var C=','Object.assign(C,'+J(o)+');')}
function rep(h,a,b,all){if(!a)return h;return all?h.split(a).join(b):h.replace(a,()=>b)}
function hideCss(h,css){return h.replace('</head>','<style id="digi-fill">'+css+'</style></head>')}
function sectionWith(h,txt){const i=h.indexOf(txt);if(i<0)return h;const s=h.lastIndexOf('<section',i);if(s<0)return h;return h.slice(0,s+8)+' hidden style="display:none!important"'+h.slice(s+8)}

const FILLS={
 bautismo(h,d,w){const D=wDate(d);const nom=d.nombre||'';const hora=d.hora||'00:00';
  if(D){h=h.replace(/var CFG=\{[^\n]*\};/,()=>'var CFG={date:new Date('+jsq(d.fecha+'T'+hora+':00-03:00')+'),endH:5,title:'+jsq('Bautismo de '+nom)+',loc:'+jsq([d.lugar,d.direccion].filter(Boolean).join(', '))+',alias:'+jsq(d.alias||'')+'};');
   h=rep(h,'id="dsmall">Sábado 16 de enero de 2027<','id="dsmall">'+hesc(D.dia+' '+D.n+' de '+D.mes+' de '+D.y)+'<');}
  h=rep(h,'id="nm">Nombre<','id="nm">'+hesc(nom)+'<');h=rep(h,'id="nm2">Nombre<','id="nm2">'+hesc(nom)+'<');
  h=h.replace('<html lang="es" data-pal="cielo">','<html lang="es" data-pal="'+w.pal+'">');
  const P=splitPadres(d.padres);
  h=rep(h,'<div class="nm">Lucía y Diego</div>','<div class="nm">'+hesc(P.padres)+'</div>');h=rep(h,'<div class="nm">Carla y Juan</div>','<div class="nm">'+hesc(P.padrinos)+'</div>');
  let css='#proto{display:none!important}';
  if(!P.padres&&!P.padrinos)h=sectionWith(h,'Sus padres y padrinos');else{if(!P.padres)css+='.pp .cardw:first-child{display:none}';if(!P.padrinos)css+='.pp .cardw:last-child{display:none}'}
  const fecha=D?cap(D.dia)+' '+D.n+' de '+D.mes:'';
  h=rep(h,'<div class="t">Sábado 16 de enero · 15:00 hs</div>','<div class="t">'+hesc(fecha+(d.hora?' · '+d.hora+' hs':''))+'</div>');
  h=rep(h,'<h3>Parroquia Nuestra Señora</h3>','<h3>'+hesc(d.lugar)+'</h3>');h=rep(h,'<p>Av. San Martín 1234, San Juan</p>','<p>'+hesc(d.direccion)+'</p>');
  h=rep(h,'Parroquia Nuestra Señora, Av. San Martín 1234, San Juan',hesc([d.lugar,d.direccion].filter(Boolean).join(', ')),true);
  if(d.lugar2){h=rep(h,'<div class="t">Sábado 16 de enero · 17:00 hs</div>','<div class="t">'+hesc(fecha+(d.hora2?' · '+d.hora2+' hs':''))+'</div>');h=rep(h,'<h3>Salón Los Jardines</h3>','<h3>'+hesc(d.lugar2)+'</h3>');h=rep(h,'<p>Calle Las Rosas 567, San Juan</p>','<p>'+hesc(d.direccion2)+'</p>');h=rep(h,'Salón Los Jardines, Calle Las Rosas 567, San Juan',hesc([d.lugar2,d.direccion2].filter(Boolean).join(', ')),true)}
  else{h=rep(h,'<div class="rev" style="margin-top:40px"><h2>La celebración</h2></div>','');css+='#cel{display:none!important}'}
  const i=h.indexOf('<div class="tl">');if(i>=0){const e=h.indexOf('</section>',i);const it=[[d.hora,'Ceremonia de Bautismo']];if(d.lugar2)it.push([d.hora2||'','Celebración en '+d.lugar2]);h=h.slice(0,i)+'<div class="tl">'+it.filter(x=>x[0]).map(x=>'<div class="it"><i class="dot"></i><div class="hr gd">'+hesc(x[0])+'</div><div class="tx">'+hesc(x[1])+'</div></div>').join('')+'</div>\n  </div>\n'+h.slice(e)}
  if(d.alias)h=rep(h,'id="alias">nombre.bautismo<','id="alias">'+hesc(d.alias)+'<');else{const a=h.indexOf('<!-- REGALOS -->'),b=h.indexOf('<!-- CONFIRMACIÓN -->');if(a>0&&b>a)h=h.slice(0,a)+h.slice(b)}
  const L=parseDate(d.limite);h=rep(h,'<p class="lead">Respondé antes del 2 de enero de 2027</p>',L?'<p class="lead">Respondé antes del '+L.getDate()+' de '+MESES[L.getMonth()]+' de '+L.getFullYear()+'</p>':'');
  h=rep(h,'#BautismoDeNombre','#BautismoDe'+hesc(nom.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]/g,'')));
  return hideCss(h,css)},
 saten(h,d){const ns=String(d.nombre||'').split(/\s*(?:&|\by\b)\s*/i).filter(Boolean);const n1=ns[0]||'',n2=ns[1]||'';const D=wDate(d);const t=(d.hora||'19:00').split(':').map(Number);
  if(D)h=h.replace(/var CFG=\{[^\n]*\};/,()=>'var CFG={n1:'+jsq(n1)+',n2:'+jsq(n2)+',date:new Date('+D.y+','+(+D.mm-1)+','+D.n+','+t[0]+','+(t[1]||0)+',0),place:'+jsq([d.lugar,d.direccion].filter(Boolean).join(', '))+',title:'+jsq('Boda de '+n1+' y '+n2)+'};');
  h=rep(h,'>Sofía<','>'+hesc(n1)+'<',true);h=rep(h,'>Mateo<','>'+hesc(n2)+'<',true);h=rep(h,'Sofía &amp; Mateo',hesc(n1+' & '+n2),true);
  h=rep(h,'S &amp; M',hesc((n1[0]||'')+' & '+(n2[0]||'')));
  if(D){h=rep(h,'20 · 03 · 2027',D.dd+' · '+D.mm+' · '+D.y,true);h=rep(h,'SÁBADO · 20 · MARZO · 2027',(D.dia+' · '+D.n+' · '+D.mes+' · '+D.y).toUpperCase(),true);h=rep(h,'Sábado 20 de marzo · 19:00 h',hesc(cap(D.dia)+' '+D.n+' de '+D.mes+(d.hora?' · '+d.hora+' h':'')))}
  h=rep(h,'<h3>Estancia Los Aromos</h3>','<h3>'+hesc(d.lugar)+'</h3>');h=rep(h,'<p>Camino de los Álamos 1250<br>Pilar, Buenos Aires</p>','<p>'+hesc(d.direccion)+'</p>');
  if(d.alias)h=rep(h,'id="alias">SOFIA.MATEO.BODA<','id="alias">'+hesc(d.alias.toUpperCase())+'<');
  const tag=(n1+'Y'+n2+(D?D.y:'')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]/g,'');h=rep(h,'#SofiaYMateo2027','#'+tag);
  if(d.frase)h=rep(h,'Junto a nuestras familias<br>celebramos el comienzo de nuestra historia',hesc(d.frase));
  if(d.dress)h=rep(h,'Código de vestimenta</span></h2>','Código de vestimenta</span></h2>');
  h=sectionWith(h,'Cronograma');return h},
 xv(h,d){const P=splitPadres(d.padres);const o={name:d.nombre||'',date:d.fecha||'',time:d.hora||'',place:d.lugar||'',address:d.direccion||'',parents:P.padres?'Junto a mis padres, '+P.padres:'',alias:d.alias||''};
  h=h.replace(/(var EV=\{[\s\S]*?\};)/,(m)=>m+'\nObject.assign(EV,'+JSON.stringify(o).replace(/</g,'\\u003c')+');');
  if(!d.alias)h=sectionWith(h,'Tu presencia es mi mejor regalo');
  h=sectionWith(h,'Cómo será la noche');return hideCss(h,'#pbtn,#pnl{display:none!important}')},
 holo(h,d){const o={name:d.nombre||'',date:d.fecha||'',time:d.hora||'',place:d.lugar||'',address:d.direccion||'',alias:d.alias||'',wa:d.wa||'',frase:d.frase||'',dress:d.dress||'',prog:d.programa||''};
  return h.replace(/(var EV=\{[^\n]*\};)/,(m)=>m+'\nObject.assign(EV,'+JSON.stringify(o).replace(/</g,'\\u003c')+');')},
 bloques(h,d){const I=infD(d);const o={nombre:I.nom.toUpperCase(),fecha:d.fecha||'',lugar:I.lugar,dir:I.dir,alias:I.alias?I.alias.toUpperCase():''};if(I.dress)o.vest=I.dress;
  h=afterObj(h,'var SAMPLE=','Object.assign(SAMPLE,'+J(o)+');');
  h=afterObj(h,'var S=','Object.assign(S,'+J({nombre:I.nom,fecha:d.fecha||'',ini:I.ini,fin:I.fin,lugar:I.lugar,dir:I.dir,alias:I.alias,vest:I.dress})+');'+(I.edad?'S.edad='+(+I.edad)+';':''));
  /* la entregada se ve como invitación, sin el editor */
  h=h.replace(/<\/body>(?![\s\S]*<\/body>)/,'<script>document.body.classList.add("vw")<\/script></body>');
  return hideCss(h,'.tabs,.panel{display:none!important}')},
 pixeles(h,d){const I=infD(d);const o={nombre:I.nom,fecha:d.fecha||'',horaInicio:I.ini,horaFin:I.fin,lugar:I.lugar,direccion:I.dir,mapa:I.mapa,whatsappAnfitrion:I.wa,alias:I.alias,aliasTitular:''};if(I.edad)o.edad=+I.edad;if(I.dress)o.vestimenta=I.dress;
  return setC(h,o)},
 autos(h,d){const I=infD(d);const o={nombre:I.nom,fecha:d.fecha||'',horaInicio:I.ini,horaFin:I.fin,lugar:I.lugar,direccion:I.dir,mapa:I.mapa};if(I.edad)o.edad=+I.edad;
  return setC(h,o)},
 estrellas(h,d){const I=infD(d);const o={nombre:I.nom,fecha:d.fecha||'',horaInicio:I.ini,horaFin:I.fin,lugar:I.lugar,direccion:I.dir,mapa:I.mapa,whatsappAnfitrion:I.wa};if(I.edad)o.edad=+I.edad;
  return setC(h,o)},
 sheriff(h,d){const I=infD(d),D=I.D,n=hesc(I.nom),e=I.edad||'';const hr=x=>{const [a,b]=x.split(':').map(Number);const t=a<12?'de la mañana':a<20?'de la tarde':'de la noche';return (a%12||12)+(b?':'+String(b).padStart(2,'0'):'')+' '+t};
  const desde='De '+hr(I.ini).replace(/ de la (mañana|tarde|noche)$/,'')+' a '+hr(I.fin);
  h=rep(h,'Marcos',n,true);h=rep(h,'MARCOS',n.toUpperCase(),true);
  if(e){h=rep(h,'cumpliendo 5','cumpliendo '+e,true);h=rep(h,'<b>5</b>','<b>'+e+'</b>');h=rep(h,'<span class="five">5</span>','<span class="five">'+e+'</span>')}
  if(D){const mesA=D.mes.slice(0,3).toUpperCase(),diaA=D.dia.slice(0,3).toUpperCase().replace('SÁ','SÁ');
   h=rep(h,'Sábado 12 de diciembre de 2026, de 3 a 6 de la tarde',cap(D.dia)+' '+D.n+' de '+D.mes+' de '+D.y+', '+desde.toLowerCase(),true);
   h=rep(h,'Sábado 12 de diciembre · 15:00 h',cap(D.dia)+' '+D.n+' de '+D.mes+' · '+I.ini+' h');
   h=rep(h,'<span class="side">SÁB</span>','<span class="side">'+diaA+'</span>');h=rep(h,'<span class="day">12</span>','<span class="day">'+D.n+'</span>');h=rep(h,'DIC<small>2026</small>',mesA+'<small>'+D.y+'</small>');
   h=rep(h,'sáb 12/12, de 15 a 18 h',D.dia.slice(0,3)+' '+D.n+'/'+(+D.mm)+', de '+I.ini+' a '+I.fin+' h',true);
   h=rep(h,'new Date("2026-12-12T15:00:00-03:00")','new Date("'+d.fecha+'T'+I.ini+':00-03:00")');h=rep(h,'new Date("2026-12-12T18:00:00-03:00")','new Date("'+d.fecha+'T'+I.fin+':00-03:00")')}
  h=rep(h,'De 3 a 6 de la tarde',desde);
  h=rep(h,'<address>Salón El Rancho<br>Av. Libertador 1234, San Juan</address>','<address>'+hesc(I.lugar)+'<br>'+hesc(I.dir)+'</address>');
  h=rep(h,'place:"Salón El Rancho, Av. Libertador 1234, San Juan"','place:'+JSON.stringify(I.mapa));
  h=rep(h,'Av.+Libertador+1234%2C+San+Juan',encodeURIComponent(I.mapa).replace(/%20/g,'+'),true);h=rep(h,'Av.%20Libertador%201234%2C%20San%20Juan',encodeURIComponent(I.mapa),true);
  if(I.wa)h=rep(h,'wa:"5490000000000"','wa:'+JSON.stringify(I.wa));
  if(I.dress)h=rep(h,'¡Sombrero de vaquero bienvenido!',hesc(I.dress));
  return h},
 baby(h,d){const P=splitPadres(d.padres);const o={bebe:d.nombre||'',mama:P.padres||'',fecha:d.fecha||'',hora:d.hora||'',lugar:d.lugar||'',dir:d.direccion||'',alias:d.alias||''};if(d.frase)o.frase=d.frase;if(d.dress)o.vest=d.dress;
  h=h.replace(/(var S=\{[\s\S]*?ok:false\};)/,(m)=>m+'\nObject.assign(S,'+JSON.stringify(o).replace(/</g,'\\u003c')+');');return h}
};

function rsvpHook(d,title){if(!d.wa)return '';return '<script>(function(){var WA='+jsq(d.wa)+',EV='+jsq(title)+';function lb(el){if(el.id){var l=document.querySelector(\'label[for="\'+el.id+\'"]\');if(l)return l.textContent.trim()}var p=el.closest("label");if(p)return p.textContent.trim();var s=el.previousElementSibling;while(s&&s.tagName!=="LABEL")s=s.previousElementSibling;return s?s.textContent.trim():(el.placeholder||el.name||"")}'
 +'document.addEventListener("click",function(e){var b=e.target.closest("button,input[type=submit]");if(!b)return;var t=(b.textContent||b.value||"").trim().toLowerCase();if(!/enviar confirmaci|confirmar asistencia/.test(t)&&b.id!=="send")return;var box=b.closest("form")||b.closest(".rs")||b.closest("section")||document.body;var L=[],txt=0;var yn=box.querySelector(".yn .on");if(yn)L.push("Asistencia: "+yn.textContent.trim());'
 +'box.querySelectorAll("input,select,textarea").forEach(function(el){if(/hidden|button|submit/.test(el.type))return;if(el.offsetParent===null&&el.type!=="radio"&&el.type!=="checkbox"&&!el.value)return;var k=lb(el);if(/^acepto/i.test(k))return;if(el.type==="radio"){if(el.checked)L.push("Asistencia: "+k);return}if(el.type==="checkbox"){if(el.checked)L.push(k);return}var v=String(el.value||"").trim();if(!v)return;if(el.tagName==="SELECT"&&!el.dataset.touched){}if(el.type==="text"||el.tagName==="TEXTAREA")txt++;L.push(k+": "+v)});'
 +'if(!txt)return;window.open("https://wa.me/"+WA+"?text="+encodeURIComponent("¡Hola! Confirmo para "+EV+":\\n"+L.join("\\n")),"_blank")},true)})();<\/script>'}

async function toDataUrl(url){const r=await fetch(url);if(!r.ok)throw new Error('falta '+url);const b=await r.blob();return await new Promise(ok=>{const f=new FileReader();f.onload=()=>ok(f.result);f.readAsDataURL(b)})}
const webCache={};
async function buildWebInv(w,d){
  if(!webCache[w.dir]&&window.WEB_EMBED&&WEB_EMBED[w.dir])webCache[w.dir]=WEB_EMBED[w.dir];
  if(!webCache[w.dir]){const r=await fetch(WEB_BASE+w.dir+'/index.html');if(!r.ok)throw new Error('No encuentro la invitación web. Usá el panel online.');webCache[w.dir]=await r.text()}
  let h=webCache[w.dir].replace(/<!--WM-->[\s\S]*?<!--\/WM-->/g,'');
  // imágenes de la carpeta del diseño: van adentro del archivo
  const imgs=[...new Set((h.match(/[a-z0-9-]+\.(?:jpg|png|webp)/gi)||[]).filter(f=>!/^data/.test(f)))];
  for(const f of imgs){if(!new RegExp('(["\'(])'+f.replace('.','\\.')).test(h))continue;try{const u=await toDataUrl(WEB_BASE+w.dir+'/'+f);h=h.split('"'+f+'"').join('"'+u+'"').split('('+f+')').join('('+u+')').split("'"+f+"'").join("'"+u+"'")}catch(e){}}
  h=FILLS[w.fill](h,d,w);
  const title=(curTpl()?evTxt():'tu evento');
  h=h.replace(/<title>[^<]*<\/title>/,'<title>'+hesc(cap(title))+'</title>');
  h=h.replace(/<\/body>(?![\s\S]*<\/body>)/,rsvpHook(d,title)+'</body>');
  return h}
function webFileName(){return fileBase().replace('invitacion-','invitacion-web-')+'.html'}
async function exportWebPremium(){const w=webById(state.web);status('Armando la invitación web…');const h=await buildWebInv(w,state.data);status('');await download(new Blob([h],{type:'text/html'}),webFileName());toast('Invitación web lista. Mandala o pedime que la suba con un link.')}
async function previewWeb(){const w=webById(state.web);if(!w)return;status('Armando la vista previa…');try{const h=await buildWebInv(w,state.data);const ov=$('webPrev');ov.querySelector('iframe').srcdoc=h;ov.classList.add('on');document.body.style.overflow='hidden'}catch(e){toast(e.message)}status('')}
function closeWebPrev(){const ov=$('webPrev');ov.classList.remove('on');ov.querySelector('iframe').srcdoc='';document.body.style.overflow=''}
function selectWeb(id){const w=webById(id);if(!w)return;state.web=id;const old=curTpl();const pt=tplById(w.pair);
  if(pt&&(!old||old.ev!==pt.ev||!state.touched)){state.data={...BASE,...pt.d,letra:pt.d.letra||'Great Vibes'};state.touched=false}
  if(pt)state.tpl=pt.id;state.blank=false;
  document.querySelectorAll('.tpl').forEach(b=>b.classList.toggle('sel',b.dataset.web===id));
  fillForm();updatePhotoUI();redraw();updateWebUI();renderItems();renderMsg();toast('Elegiste la invitación web "'+w.name+'". Completá los datos y tocá "Ver invitación web".')}
function updateWebUI(){const w=state.web&&webById(state.web);['webPrevBtn','webPrevBtn2'].forEach(k=>{const e=$(k);if(e)e.style.display=w?'':'none'});const sub=$('exWebSub');if(sub)sub.textContent=w?'invitación web "'+w.name+'"':'archivo listo para subir';
  const box=$('webBox');if(box){box.classList.toggle('on',!!w);if(w)box.innerHTML='Estás armando la <b>invitación web '+hesc(w.name)+'</b>. Arriba ves la tarjeta que va con ella (imagen, PDF y video salen con ese diseño). Tocá <b>Ver invitación web</b> para ver la página completa.'}}
