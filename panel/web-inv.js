/* ============ invitaciones web completas (de tus diseños) ============ */
const WEBS=[
 {id:'w-bautismo-i-celeste',ev:'Bautismo',name:'Bautismo I · celeste',dir:'bautismo-i',pal:'cielo',pair:'bau-paloma-celeste',cover:'bautismo-i.jpg',fill:'bautismo'},
 {id:'w-bautismo-i-rosa',ev:'Bautismo',name:'Bautismo I · rosa',dir:'bautismo-i',pal:'rosa',pair:'bau-paloma-rosa',cover:'bautismo-i-rosa.jpg',fill:'bautismo'},
 {id:'w-bautismo-i-verde',ev:'Bautismo',name:'Bautismo I · verde',dir:'bautismo-i',pal:'verde',pair:'bau-paloma-verde',cover:'bautismo-i-verde.jpg',fill:'bautismo'},
 {id:'w-bautismo-i-lila',ev:'Bautismo',name:'Bautismo I · lila',dir:'bautismo-i',pal:'lavanda',pair:'bau-paloma-lila',cover:'bautismo-i-lila.jpg',fill:'bautismo'},
 {id:'w-bodas-saten',ev:'Bodas',name:'Satén',dir:'bodas-saten',pair:'boda-saten',cover:'bodas-saten.jpg',fill:'saten'},
 {id:'w-xv-medianoche',ev:'15 años',name:'XV Medianoche',dir:'xv-medianoche',pair:'xv-medianoche',cover:'xv-medianoche.jpg',fill:'xv'},
 {id:'w-baby-ii',ev:'Baby shower',name:'Baby shower II',dir:'baby-shower-ii',pair:'baby-arcoiris',cover:'baby-shower-ii.jpg',fill:'baby'},
 {id:'w-baby-iii',ev:'Baby shower',name:'Baby shower III',dir:'baby-shower-iii',pair:'baby-ciguena',cover:'baby-shower-iii.jpg',fill:'baby'},
 {id:'w-baby-iv',ev:'Baby shower',name:'Baby shower IV',dir:'baby-shower-iv',pair:'baby-arcoiris',cover:'baby-shower-iv.jpg',fill:'baby'},
];
const WEB_BASE='../demos/',WEB_IMG='../img/';
const webById=id=>WEBS.find(w=>w.id===id);
const webCover=w=>(window.WEB_COVERS&&WEB_COVERS[w.cover])||WEB_IMG+w.cover;
const jsq=s=>JSON.stringify(String(s==null?'':s)).replace(/</g,'\\u003c');
const hesc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function wDate(d){const f=parseDate(d.fecha);return f?{f,dia:DIAS[f.getDay()],n:f.getDate(),mes:MESES[f.getMonth()],mm:String(f.getMonth()+1).padStart(2,'0'),dd:String(f.getDate()).padStart(2,'0'),y:f.getFullYear()}:null}
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
function splitPadres(txt){const out={padres:'',padrinos:'',otros:[]};String(txt||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(l=>{const v=l.replace(/^[^:]{0,30}:\s*/,'');if(/padrin/i.test(l))out.padrinos=v;else if(/pap|padres|mam/i.test(l))out.padres=v;else out.otros.push(l)});if(!out.padres&&out.otros.length)out.padres=out.otros.shift().replace(/^[^:]{0,30}:\s*/,'');return out}
function rep(h,a,b,all){if(!a)return h;return all?h.split(a).join(b):h.replace(a,()=>b)}
function hideCss(h,css){return h.replace('</head>','<style id="digi-fill">'+css+'</style></head>')}
function sectionWith(h,txt){const i=h.indexOf(txt);if(i<0)return h;const s=h.lastIndexOf('<section',i);if(s<0)return h;return h.slice(0,s+8)+' hidden style="display:none!important"'+h.slice(s+8)}

const FILLS={
 bautismo(h,d,w){const D=wDate(d);const nom=d.nombre||'';const hora=d.hora||'00:00';
  if(D){h=h.replace(/var CFG=\{[^\n]*\};/,()=>'var CFG={date:new Date('+jsq(d.fecha+'T'+hora+':00-03:00')+'),endH:5,title:'+jsq('Bautismo de '+nom)+',loc:'+jsq([d.lugar,d.direccion].filter(Boolean).join(', '))+',alias:'+jsq(d.alias||'')+'};');
   h=rep(h,'id="dsmall">Sábado 16 de enero de 2027<','id="dsmall">'+hesc(D.dia+' '+D.n+' de '+D.mes+' de '+D.y)+'<');}
  h=rep(h,'id="nm">Mateo<','id="nm">'+hesc(nom)+'<');h=rep(h,'id="nm2">Mateo<','id="nm2">'+hesc(nom)+'<');
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
  if(pt)state.tpl=pt.id;
  document.querySelectorAll('.tpl').forEach(b=>b.classList.toggle('sel',b.dataset.web===id));
  fillForm();updatePhotoUI();redraw();updateWebUI();renderItems();renderMsg();toast('Elegiste la invitación web "'+w.name+'". Completá los datos y tocá "Ver invitación web".')}
function updateWebUI(){const w=state.web&&webById(state.web);['webPrevBtn','webPrevBtn2'].forEach(k=>{const e=$(k);if(e)e.style.display=w?'':'none'});const sub=$('exWebSub');if(sub)sub.textContent=w?'invitación web "'+w.name+'"':'archivo listo para subir';
  const box=$('webBox');if(box){box.classList.toggle('on',!!w);if(w)box.innerHTML='Estás armando la <b>invitación web '+hesc(w.name)+'</b>. Arriba ves la tarjeta que va con ella (imagen, PDF y video salen con ese diseño). Tocá <b>Ver invitación web</b> para ver la página completa.'}}
