// Genera JPG, PDF, video y web de muestra de cada plantilla del panel.
// Uso: python3 -m http.server 8811 &  y luego  node control/generar.js http://localhost:8811/panel/ . [ids...]
const {chromium}=require('playwright');const fs=require('fs');const {spawn}=require('child_process');
(async()=>{const [url,repo,...only]=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.evaluate(async()=>{await document.fonts.ready;await Promise.all(['Great Vibes','Fredoka','Cormorant Garamond','Montserrat','Allura'].map(f=>document.fonts.load('40px "'+f+'"').catch(()=>0)));
 window.__WM='soft';window.__CAP={};window.download=async(blob,name)=>{window.__CAP.blob=blob;window.__CAP.name=name};
 const O=window.jspdf.jsPDF;window.jspdf={...window.jspdf,jsPDF:function(...a){const q=new O(...a);const oa=q.addImage.bind(q);q.addImage=(d,...r)=>{window.__CAP.pdfimg=d;return oa(d,...r)};return q}}});
const ids=only.length?only:await p.evaluate(()=>TEMPLATES.map(t=>t.id));
const b64=async(expr,arg)=>Buffer.from((await p.evaluate(expr,arg)).split(',')[1],'base64');
for(const id of ids){
 await p.evaluate(id=>{state.foto=null;state.touched=false;selectTpl(id)},id);
 const W=await p.evaluate(()=>{const c=fullCanvas();window.__C=c;return 1});
 fs.writeFileSync(`${repo}/muestras/d/${id}.jpg`,await b64(()=>window.__C.toDataURL('image/jpeg',.88)));
 fs.writeFileSync(`${repo}/img/t-${id}.jpg`,await b64(()=>{const c=document.createElement('canvas');c.width=540;c.height=960;const x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(window.__C,0,0,540,960);return c.toDataURL('image/jpeg',.86)}));
 // pdf
 await p.evaluate(()=>exportPdf());
 fs.writeFileSync(`${repo}/muestras/d/${id}.pdf`,await b64(()=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(window.__CAP.blob)})));
 fs.writeFileSync(`${repo}/muestras/d/${id}-pdf.jpg`,await b64(()=>new Promise(ok=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=720;c.height=Math.round(i.height*720/i.width);c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.85))};i.onerror=()=>ok('data:,');i.src=window.__CAP.pdfimg})));
 // web
 await p.evaluate(()=>exportWeb());
 let html=await p.evaluate(()=>window.__CAP.blob.text());
 html=html.replace(/<!--WM-->[\s\S]*?<!--\/WM-->/g,'');
 const WM=fs.readFileSync(__dirname+'/wm.html','utf8').trim();
 html=html.replace(/<\/body>\s*<\/html>\s*$/i,WM+'</body></html>');
 if(!html.includes('digiWM'))html+=WM;
 fs.writeFileSync(`${repo}/muestras/d/${id}.html`,html);
 // video: cuadros fijos a 30 fps
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-preset','medium','-crf','24','-movflags','+faststart',`${repo}/muestras/d/${id}.mp4`]);
 const fin=new Promise(ok=>ff.on('close',ok));
 await p.evaluate(()=>{const c=document.createElement('canvas');c.width=540;c.height=960;window.__V=c});
 for(let f=0;f<300;f++){const buf=await b64(f=>{const c=window.__V,x=c.getContext('2d'),t=f/30,S=540/W;x.setTransform(S,0,0,S,0,0);x.clearRect(0,0,W,H);render(x,curTpl(),state.data,t);sparkles(x,t,curTpl());return c.toDataURL('image/jpeg',.9)},f);if(!ff.stdin.write(buf))await new Promise(ok=>ff.stdin.once('drain',ok))}
 ff.stdin.end();await fin;console.log('ok',id);
}
await b.close()})().catch(e=>{console.error(e);process.exit(1)});
