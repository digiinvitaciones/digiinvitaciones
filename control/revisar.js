// Revisión automática de DIGI INVITACIONES. Uso (desde la carpeta del repo):
//   python3 -m http.server 8811 &   y luego   node control/revisar.js
// Recorre catálogo, panel, demos web y muestras, y lista todo lo que no cumple la lista de control.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');const URL='http://localhost:8811/';
const R=p=>fs.readFileSync(path.join(ROOT,p),'utf8');const EX=p=>fs.existsSync(path.join(ROOT,p));
const fallas=[];const mal=(donde,que)=>fallas.push(`✗ ${donde}: ${que}`);
const COBRE=/#(c98f48|e2b676|f7dcae|d9a354|a8742a|8a5a1c|c08a3e|e8c07c|93611f)\b/i;
const PADRES=/Junto a (mis|sus|nuestros) padres, [A-ZÁÉÍÓÚ]|Laura y Mart[ií]n/;
(async()=>{
 const b=await chromium.launch();const page=await b.newPage({viewport:{width:390,height:800}});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 // ---------- catálogo ----------
 await page.goto(URL);await page.waitForTimeout(2000);
 const cat=R('index.html');
 const D=[...cat.matchAll(/\{[^{}]*ev:'[^']+'[^{}]*tipo:'(web|tarjeta)'[^{}]*\}/g)].map(m=>m[0]);
 const pair=(()=>{const m=/var DEMO_PAIR=\{([^}]*)\}/.exec(cat);const o={};[...m[1].matchAll(/'([^']+)':'([^']+)'/g)].forEach(x=>o[x[1]]=x[2]);return o})();
 const usados=new Set();
 for(const e of D){const n=/n:'([^']+)'/.exec(e)[1],img=/img:'([^']+)'/.exec(e)[1],demo=(/demo:'demos\/([^/']+)/.exec(e)||[])[1];
  const t=(/img\/t-([a-z0-9-]+)\.jpg/.exec(img)||[])[1]||(demo&&pair[demo]);
  if(!EX(img))mal(n,'falta la imagen de la tarjeta '+img);
  if(!t){mal(n,'no tiene JPG/PDF/video asociados');continue}
  usados.add(t);
  for(const x of ['.jpg','-pdf.jpg','.pdf','.mp4','.html'])if(!EX('muestras/d/'+t+x))mal(n,'falta muestras/d/'+t+x);
  if(demo&&!/img\/t-/.test(img)&&!/^web-/.test(t))mal(n,'la tarjeta del catálogo no es la misma imagen que el JPG');
  if(demo&&/^w-/.test(t))mal(n,'usa capturas de la web en vez de plantilla del panel');
 }
 if(await page.evaluate(()=>document.querySelectorAll('details[open]').length))mal('Catálogo','hay pestañas abiertas al iniciar');
 // ---------- panel ----------
 await page.goto(URL+'panel/');await page.waitForTimeout(3000);
 const P=await page.evaluate(()=>({t:TEMPLATES.map(t=>({id:t.id,ev:t.ev,photo:!!t.photo,kind:t.kind,d:t.d,noText:!!t.noText,datos:!!t.datos})),g:typeof TPL_G!=='undefined'?TPL_G:{},open:[...document.querySelectorAll('details[open]')].map(d=>d.id||d.className)}));
 if(P.open.length)mal('Panel','pestañas abiertas al iniciar: '+P.open.join(', '));
 for(const t of P.t){const d=t.d||{};
  if(usados.has(t.id)){if(t.noText&&!t.datos)mal('Plantilla '+t.id,'el JPG/PDF/video no muestra los datos (fecha, hora y lugar)');
   if(!t.noText&&!(d.fecha&&d.hora&&d.lugar))mal('Plantilla '+t.id,'le falta fecha, hora o lugar en el JPG/PDF/video')}
  if(t.photo)mal('Plantilla '+t.id,'usa foto de personas por defecto');
  if(d.padres)mal('Plantilla '+t.id,'tiene nombres de padres');
  if(P.g[t.id]==='todos'&&!t.noText&&d.nombre!=='Nombre')mal('Plantilla '+t.id,'es neutra y su nombre de ejemplo es "'+d.nombre+'" (debe ser "Nombre")');
 }
 // códigos cortos (codigos.js): únicos, uno por diseño, y el link directo #CODIGO abre ese diseño
 {await page.goto(URL);await page.waitForTimeout(1500);const k=await page.evaluate(()=>{const c=window.DIGI_CODIGOS||{};const v=Object.values(c);const r=[];
   if(new Set(v).size!==v.length)r.push('hay dos códigos para el mismo diseño');DISENOS.forEach(d=>{if(!digiCod(d))r.push(d.n+' no tiene código')});
   Object.keys(c).forEach(x=>{if(!/^[A-Z]{2}-\d{2,3}$/.test(x))r.push('código mal escrito: '+x)});return r});k.forEach(x=>mal('Códigos',x));
  const c1=await page.evaluate(()=>Object.keys(window.DIGI_CODIGOS)[5]);await page.goto(URL+'#'+c1);await page.waitForTimeout(1800);
  if(!(await page.evaluate(()=>!!document.querySelector('.card.hl'))))mal('Catálogo','el link directo #'+c1+' no muestra el diseño');}
 // precios: el panel cobra lo mismo que muestra el catálogo, y el pedido pegado marca los formatos correctos
 {const cp=await (async()=>{await page.goto(URL);await page.waitForTimeout(1500);return page.evaluate(()=>PRECIOS)})();
  await page.goto(URL+'panel/');await page.waitForTimeout(2500);
  const pp=await page.evaluate(()=>({p:PRODUCTS_DEF,f:formatosDe('Lo quiero en: Imagen JPG, PDF interactivo, Video animado, Web Premium'),g:formatosDe('Lo quiero en: Invitación web')}));
  const MAPA={tarjeta:'imagen',pdf:'pdf',video:'video',web:'web',webp:'premium'};
  for(const x of pp.p){const k=MAPA[x.id];if(!k)continue;
   if(!cp.normal[k]||cp.normal[k][1]!==x.now||cp.normal[k][0]!==x.old)mal('Precios',x.n+' (resto de eventos): panel '+x.now+'/'+x.old+' y catálogo '+(cp.normal[k]||[]).slice().reverse().join('/'));
   if(!cp.gala[k]||cp.gala[k][1]!==x.nowG||cp.gala[k][0]!==x.oldG)mal('Precios',x.n+' (bodas y 15): panel '+x.nowG+'/'+x.oldG+' y catálogo '+(cp.gala[k]||[]).slice().reverse().join('/'))}
  if(JSON.stringify(pp.f)!==JSON.stringify(['tarjeta','video','pdf','webp']))mal('Panel','al pegar el pedido no marca bien los formatos: '+JSON.stringify(pp.f));
  {await page.goto(URL);await page.waitForTimeout(1200);const fx=await page.evaluate(()=>({i:digiFmts('Infantiles').map(f=>f.k),b:digiFmts('Bodas').map(f=>f.k),q:digiFmts('15 años').map(f=>f.k)}));if(fx.i.includes('premium')||fx.q.includes('premium'))mal('Catálogo','ofrece Web Premium fuera de Bodas');if(!fx.b.includes('premium'))mal('Catálogo','Bodas no ofrece Web Premium');await page.goto(URL+'panel/');await page.waitForTimeout(2500);}
  if(JSON.stringify(pp.g)!==JSON.stringify(['web']))mal('Panel','al pegar un pedido de web común no marca "Invitación web"');}
 if(!/const card=false/.test(R('panel/index.html')))mal('Panel','los diseños vuelven a tener recuadro de vidrio esmerilado');
 {const c=R('index.html');if(!/addEventListener\('contextmenu'/.test(c)||!/class="wmk" id="vBox"/.test(c)||!/class="wmk" data-fmt/.test(c)||!/-webkit-touch-callout:none/.test(c)||!/\.wmk::after[^}]*sello-bot\.png/.test(c))mal('Catálogo','las muestras se pueden descargar o no tienen el sello de muestra')}
 // ---------- archivos: dorado, Floot, padres ----------
 const html=['index.html','panel/index.html','panel/web-inv.js',...fs.readdirSync(path.join(ROOT,'demos')).map(d=>'demos/'+d+'/index.html'),...fs.readdirSync(path.join(ROOT,'muestras/d')).filter(f=>f.endsWith('.html')).map(f=>'muestras/d/'+f)];
 for(const f of html){const s=R(f).replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]+/g,'');
  if(COBRE.test(s))mal(f,'usa el dorado cobrizo viejo ('+COBRE.exec(s)[0]+')');
  if(/Siempre Viva|Calle cualquiera|Cualquier lugar/i.test(s))mal(f,'tiene una dirección de relleno o de una serie (usar Av. Libertador 1234, San Juan)');
  if(/floot/i.test(s)&&!/panel\/index\.html/.test(f))mal(f,'tiene un link o mención a Floot');
  if(PADRES.test(s))mal(f,'tiene nombres de padres');
  if(/class="rays"|#cover \.rays|repeating-conic-gradient\(from/.test(s))mal(f,'tiene el efecto de rayos que giran (a Sandra no le gusta)');
  if(/^(demos|muestras)/.test(f)&&!/<!--WM-->/.test(s))mal(f,'falta el bloqueo de botones de muestra (sello WM)');
  if(/^(demos|muestras)/.test(f)&&!/id="digiProt">#digiMark\{[^}]*sello-bot\.png[\s\S]*<!--\/WM-->/.test(s))mal(f,'la muestra no tiene el sello DIGI INVITACIONES · MUESTRA ni el bloqueo de descarga');
  if(/^(demos|muestras)/.test(f)&&!/IntersectionObserver/.test(s))mal(f,'no tiene efectos al deslizar');
  if(/^muestras/.test(f)){if(!/class="reveal end"/.test(s))mal(f,'no tiene cierre/despedida');
   const ic=s.indexOf('class="cal"'),ia=s.indexOf('Agendar en mi calendario');if(ic>0&&ia>0&&ia<ic)mal(f,'el botón Agendar no está debajo del calendario')}
 }
 // ---------- páginas web en el navegador ----------
 const webs=[...fs.readdirSync(path.join(ROOT,'demos')).map(d=>'demos/'+d+'/'),...[...usados].map(t=>'muestras/d/'+t+'.html')];
 for(const w of webs){const p=await b.newPage({viewport:{width:360,height:740}});const pe=[];p.on('pageerror',e=>pe.push(e.message));
  await p.goto(URL+w);await p.waitForTimeout(2500);
  const nm=await p.evaluate(()=>{const n=document.getElementById('nm');return n?n.scrollWidth-n.parentNode.clientWidth:-1});
  if(nm>4)mal(w,'el nombre de la portada se corta');
  await p.evaluate(()=>{const o=[...document.querySelectorAll('button,a')].find(x=>x.offsetParent&&/abrir|tocá|ver invitación/i.test(x.textContent));if(o)o.click()});await p.waitForTimeout(3500);
  const r=await p.evaluate(()=>{const v=e=>e.offsetParent!==null;return{open:[...document.querySelectorAll('details[open],.acc.open,[aria-expanded="true"]')].filter(v).map(e=>e.textContent.trim().slice(0,25)),
   fotos:[...document.querySelectorAll('img')].filter(i=>v(i)&&i.naturalWidth>200&&!/card/.test(i.className)&&!i.closest('[data-ilustracion]')&&/jpe?g/.test(i.src.slice(0,30))).map(i=>i.alt||i.className||'img')}});
  if(r.open.length)mal(w,'pestañas abiertas al iniciar: '+r.open.join(' / '));
  const OK_ILU={'demos/baby-shower-ii/':1};if(r.fotos.length&&!OK_ILU[w])mal(w,'muestra '+r.fotos.length+' foto(s): revisar que no sean de personas ('+r.fotos.join(', ')+')');
  if(pe.length)mal(w,'error en la página: '+pe[0]);await p.close()}
 // ---------- pedidos de punta a punta: cada diseño y cada combinación de formatos, del catálogo al panel ----------
 {const f=await require('./webs-infantiles.js')(URL);f.forEach(x=>fallas.push(x))}
 {const r=await require('./pedidos.js')(URL);r.fallas.forEach(f=>fallas.push(f));console.log('Pedidos probados del catálogo al panel: '+r.total)}
 await b.close();
 console.log(fallas.length?fallas.join('\n')+`\n\n${fallas.length} cosa(s) para corregir.`:'✓ Todo cumple la lista de control.');
 process.exit(fallas.length?1:0)})();
