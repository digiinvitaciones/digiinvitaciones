// Control: cada invitación web infantil del panel se completa con los datos del cliente
// y no le queda ningún dato de ejemplo (nombres, salón, dirección, fecha). Lo corre revisar.js.
const {chromium}=require('playwright');
const VIEJOS=['Mateo','MATEO','Marcos','MARCOS','Sofía','Mundo Bloques','Mundo Cubos','Pista Veloz','Los Robles','El Rancho','Fantasía','Libertador 1234','12 de diciembre','17 de abril','mateo.cumple','MATEO.CUMPLES'];
async function websInf(URL){const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const fallas=[];
 await p.goto(URL+'panel/');await p.waitForTimeout(3000);
 const ids=await p.evaluate(()=>WEBS.filter(w=>w.ev==='Infantiles').map(w=>w.id));
 if(ids.length<5)fallas.push('✗ Panel: faltan webs infantiles ('+ids.length+')');
 for(const id of ids){
  const h=await p.evaluate(async id=>{selectWeb(id);Object.assign(state.data,{nombre:'Juana Pérez',numero:'7',fecha:'2027-05-22',hora:'15:30',lugar:'Quinta Los Aromos',direccion:'Calle Rivadavia 950, Rawson',wa:'5492645551234',alias:'juana.cumple7',dress:''});return await buildWebInv(webById(id),state.data)},id);
  const q=await b.newPage({viewport:{width:390,height:844}});const errs=[];q.on('pageerror',e=>errs.push(e.message));
  await q.setContent(h,{waitUntil:'load'});await q.waitForTimeout(1500);
  const t=await q.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);return document.documentElement.innerText});
  const name=id.replace('w-inf-','');
  for(const v of ['Juana','Quinta Los Aromos','Rivadavia 950'])if(!t.includes(v)&&!t.includes(v.toUpperCase()))fallas.push('✗ Web '+name+': no muestra "'+v+'"');
  if(!/22/.test(t)||!/mayo|MAYO|may/i.test(t))fallas.push('✗ Web '+name+': no muestra la fecha (22 de mayo)');
  for(const v of VIEJOS)if(t.includes(v))fallas.push('✗ Web '+name+': le quedó el dato de ejemplo "'+v+'"');
  errs.forEach(e=>fallas.push('✗ Web '+name+': error '+e));await q.close()}
 await b.close();return fallas}
module.exports=websInf;
if(require.main===module)websInf(process.argv[2]||'http://localhost:8811/').then(f=>console.log(f.length?f.join('\n'):'✓ Webs infantiles OK'));
