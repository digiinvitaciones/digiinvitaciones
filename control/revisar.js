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
 const P=await page.evaluate(()=>({t:TEMPLATES.map(t=>({id:t.id,ev:t.ev,photo:!!t.photo,kind:t.kind,d:t.d,noText:!!t.noText})),g:typeof TPL_G!=='undefined'?TPL_G:{},open:[...document.querySelectorAll('details[open]')].map(d=>d.id||d.className)}));
 if(P.open.length)mal('Panel','pestañas abiertas al iniciar: '+P.open.join(', '));
 for(const t of P.t){const d=t.d||{};
  if(t.photo)mal('Plantilla '+t.id,'usa foto de personas por defecto');
  if(d.padres)mal('Plantilla '+t.id,'tiene nombres de padres');
  if(P.g[t.id]==='todos'&&!t.noText&&d.nombre!=='Nombre')mal('Plantilla '+t.id,'es neutra y su nombre de ejemplo es "'+d.nombre+'" (debe ser "Nombre")');
 }
 if(!/const card=false/.test(R('panel/index.html')))mal('Panel','los diseños vuelven a tener recuadro de vidrio esmerilado');
 // ---------- archivos: dorado, Floot, padres ----------
 const html=['index.html','panel/index.html','panel/web-inv.js',...fs.readdirSync(path.join(ROOT,'demos')).map(d=>'demos/'+d+'/index.html'),...fs.readdirSync(path.join(ROOT,'muestras/d')).filter(f=>f.endsWith('.html')).map(f=>'muestras/d/'+f)];
 for(const f of html){const s=R(f).replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]+/g,'');
  if(COBRE.test(s))mal(f,'usa el dorado cobrizo viejo ('+COBRE.exec(s)[0]+')');
  if(/floot/i.test(s)&&!/panel\/index\.html/.test(f))mal(f,'tiene un link o mención a Floot');
  if(PADRES.test(s))mal(f,'tiene nombres de padres');
  if(/^(demos|muestras)/.test(f)&&!/<!--WM-->/.test(s))mal(f,'falta el bloqueo de botones de muestra (sello WM)');
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
 await b.close();
 console.log(fallas.length?fallas.join('\n')+`\n\n${fallas.length} cosa(s) para corregir.`:'✓ Todo cumple la lista de control.');
 process.exit(fallas.length?1:0)})();
