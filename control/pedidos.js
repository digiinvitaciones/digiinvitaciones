// Control de punta a punta: para CADA diseño del catálogo y CADA combinación de formatos,
// arma el mensaje "Quiero este diseño", lo pega en el panel y verifica diseño, formatos y total.
// Uso: node control/pedidos.js [url]   (devuelve la lista de fallas; la usa revisar.js)
const {chromium}=require('playwright');
async function pedidos(URL){
 const b=await chromium.launch();const page=await b.newPage({viewport:{width:390,height:800}});const fallas=[];const errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.goto(URL);await page.waitForTimeout(1500);
 const casos=await page.evaluate(()=>{const out=[];const K={imagen:'tarjeta',pdf:'pdf',video:'video',web:'web',premium:'webp'};
  DISENOS.forEach(d=>{const fs=digiFmts(d.ev).map(f=>f.k);const n=fs.length;
   for(let m=1;m<(1<<n);m++){const sel=fs.filter((k,i)=>m&(1<<i));if(sel.includes('web')&&sel.includes('premium'))continue;
    const url=digiWant(d,sel);const msg=decodeURIComponent(url.split('text=')[1]);
    const t=sel.reduce((a,k)=>a+digiPr(d.ev,k)[1],0);
    const mm=/c[oó]digo ([a-z0-9-]+)/.exec(msg);const code=mm?mm[1]:'';const want=d.demo?'w-'+(/demos\/([a-z0-9-]+)/.exec(d.demo)||[])[1]:(/img\/t-([a-z0-9-]+)\.jpg/.exec(d.img)||[])[1];if(code!==want){out.push({bad:d.n+': el catálogo manda código '+code+' y debería ser '+want});continue}
    out.push({dp:JSON.stringify(digiPair),n:d.n,ev:d.ev,code,msg,items:sel.map(k=>K[k]).sort(),t})}});return out});
 // formulario de la página: se completa para cada diseño (con todos sus formatos menos web común si hay premium)
 const forms=await page.evaluate(()=>{const out=[];const D=new Date();D.setDate(D.getDate()+40);const iso=D.toISOString().slice(0,10);
  for(const d of DISENOS){const fs=digiFmts(d.ev).map(f=>f.k).filter((k,i,a)=>!(k==='web'&&a.includes('premium')));
   digiForm.open(d,fs);const set=(k,v)=>{const i=document.querySelector('#pform [data-f="'+k+'"]');if(i.type==='checkbox')i.checked=v;else i.value=v};
   set('cnombre','María Gómez');set('ctel','0264 15 555-1234');set('ciudad','San Juan');set('origen','Instagram');set('nombre','Sofía Luna');set('edad','15');set('fecha',iso);set('hora','21:30');
   set('lugar','Salón Los Olivos');set('direccion','Av. Libertador 1200, San Juan');set('mismo',true);set('alias','sofia.fiesta.15');set('acepto',true);set('notas','Colores pastel');
   const ch=digiForm.check();const t=fs.reduce((a,k)=>a+digiPr(d.ev,k)[1],0);
   out.push({n:d.n,ev:d.ev,err:ch.err,msg:digiForm.msg(),t,iso,edad:!document.getElementById('fEdadW').hidden});
   document.getElementById('fClear').click();}
  document.getElementById('fClose').click();return out});
 // casos con errores: el formulario tiene que frenarlos
 const malos=await page.evaluate(()=>{const d=DISENOS[0];digiForm.open(d,['imagen']);const set=(k,v)=>{const i=document.querySelector('#pform [data-f="'+k+'"]');if(i.type==='checkbox')i.checked=v;else i.value=v};
  const r=[];set('cnombre','Ana');set('ctel','12345');set('nombre','X');set('fecha','2020-01-01');set('hora','20:00');set('lugar','L');set('direccion','D');set('alias','mi alias con espacios');set('acepto',false);
  const c=digiForm.check();if(c.err.length<4)r.push('el formulario deja pasar datos mal escritos ('+c.err.length+' avisos)');document.getElementById('fClear').click();document.getElementById('fClose').click();return r});
 malos.forEach(m=>fallas.push('✗ Formulario: '+m));
 forms.filter(f=>f.err.length).forEach(f=>fallas.push('✗ Formulario '+f.n+': no deja enviar datos correctos: '+f.err.join(' / ')));
 await page.goto(URL+'panel/');await page.waitForTimeout(3000);
 const res=await page.evaluate(casos=>{const out=[];for(const c of casos){if(c.bad){out.push(c.bad);continue}
   document.getElementById('newClient').click();document.getElementById('c_pedido').value=c.msg;armarPedido(false);
   const items=[...state.client.items].sort();const tot=totals().now;const t=curTpl();
   const dir=c.code.replace(/^w-/,'');const wv=c.code.startsWith('w-')&&WEBS.find(w=>w.dir===dir&&w.pair===DEMO_PAIR[dir]);const okD=c.code.startsWith('w-')?(wv?state.web===wv.id:state.tpl===DEMO_PAIR[dir]):state.tpl===c.code;
   const msg=buildMsg('presupuesto');if(c.dp!==JSON.stringify(DEMO_PAIR)&&!window.__dpw){window.__dpw=1;out.push('DEMO_PAIR del panel distinto al del catálogo')}
   const err=[];if(!c.code)err.push('el catálogo no manda código');if(!okD)err.push('el panel eligió '+(state.web||state.tpl)+' en vez de '+c.code);
   if(t&&t.ev!==c.ev&&!(c.ev==='Infantiles'&&t.ev==='Primer año'))err.push('evento '+t.ev+' en vez de '+c.ev);
   if(JSON.stringify(items)!==JSON.stringify(c.items))err.push('formatos '+items.join('+')+' en vez de '+c.items.join('+'));
   if(tot!==c.t)err.push('total panel '+tot+' y catálogo '+c.t);
   if(!msg.includes(money(c.t)))err.push('el mensaje de presupuesto no dice '+money(c.t));
   if(err.length)out.push(c.n+' ('+c.ev+') ['+c.msg.split('\n')[1]+']: '+err.join('; '))}return out},casos);
 res.forEach(r=>fallas.push('✗ Pedido '+r));
 const res2=await page.evaluate(forms=>{const out=[];for(const f of forms){document.getElementById('newClient').click();document.getElementById('c_pedido').value=f.msg;armarPedido(false);
   const c=state.client,d=state.data,e=[];const exp=(a,b,n)=>{if(a!==b)e.push(n+': '+a+' en vez de '+b)};
   exp(c.nombre,'María Gómez','cliente');exp(c.tel,'5492645551234','WhatsApp del cliente');exp(c.ciudad,'San Juan','ciudad');exp(c.origen,'Instagram','cómo nos conoció');
   exp(d.nombre,'Sofía Luna','nombre');exp(d.fecha,f.iso,'fecha');exp(d.hora,'21:30','hora');exp(d.lugar,'Salón Los Olivos','lugar');exp(d.direccion,'Av. Libertador 1200, San Juan','dirección');
   exp(d.wa,'5492645551234','WhatsApp para confirmar');exp(d.alias,'sofia.fiesta.15','alias');exp(totals().now,f.t,'total');if(!(c.notas||'').includes('Colores pastel'))e.push('no guardó los comentarios');
   if(e.length)out.push(f.n+' ('+f.ev+'): '+e.join('; '))}return out},forms);
 res2.forEach(r=>fallas.push('✗ Formulario → panel '+r));errs.forEach(e=>fallas.push('✗ Error en página: '+e));
 await b.close();return {fallas,total:casos.length+forms.length}}
module.exports=pedidos;
if(require.main===module)pedidos(process.argv[2]||'http://localhost:8811/').then(r=>{console.log(r.fallas.slice(0,60).join('\n'));console.log(r.fallas.length+' fallas en '+r.total+' pedidos probados')});
