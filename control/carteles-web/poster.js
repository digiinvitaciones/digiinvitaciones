const {chromium}=require('playwright');const fs=require('fs');const {execSync}=require('child_process');
const C=JSON.parse(fs.readFileSync(__dirname+'/cfg.json','utf8'));const only=process.argv.slice(2);
const ic={cal:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
clk:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
pin:'<svg viewBox="0 0 24 24"><path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="10" r="2.6" fill="currentColor"/></svg>'};
(async()=>{const b=await chromium.launch();
for(const [k,c] of Object.entries(C)){if(only.length&&!only.includes(k))continue;
const fs_=c.fs||1;const f=`'${c.font}',sans-serif`;
const html=`<!doctype html><meta charset=utf-8><link href="https://fonts.googleapis.com/css2?family=${c.font.replace(/ /g,'+')}&display=swap" rel=stylesheet><style>
*{box-sizing:border-box;margin:0}html,body{width:390px;height:693px;overflow:hidden}
body{background:linear-gradient(${c.bgTop},${c.bgBot});font-family:${f};display:flex;flex-direction:column;align-items:center;${c.bodyCss||''}}
.top{height:${c.topH}px;flex:none;width:100%;display:flex;justify-content:center;background:${c.mask?'transparent':c.bgL}}.top img{height:100%;width:auto;max-width:100%;object-fit:contain;${c.mask?'-webkit-mask:linear-gradient(#000 82%,transparent);mask:linear-gradient(#000 82%,transparent)':''}}
.d{flex:1;width:100%;padding:10px 22px 16px;display:flex;flex-direction:column;justify-content:center;gap:${c.topH<330?14:9}px}
.r{display:flex;align-items:center;gap:12px;background:${c.card};border:2px solid ${c.bd};border-radius:14px;padding:9px 12px;color:${c.ink}}
.r svg{width:26px;height:26px;flex:none;color:${c.acc}}.r b{font-weight:400;font-size:${17*fs_}px;line-height:1.25;display:block}.r small{display:block;font-size:${12.5*fs_}px;color:${c.sub};margin-top:3px;line-height:1.3}
.e{text-align:center;color:${c.ink};font-size:${19*fs_}px;margin-top:2px;text-shadow:0 2px 0 rgba(0,0,0,.12)}
</style><div class=top><img src="file://${__dirname}/${k}-top.jpg"></div><div class=d>
<div class=r>${ic.cal}<b>${c.rows[0]}</b></div><div class=r>${ic.clk}<b>${c.rows[1]}</b></div><div class=r>${ic.pin}<span><b>${c.rows[2]}</b><small>${c.rows[3]}</small></span></div><div class=e>${c.end}</div></div>`;
fs.writeFileSync(__dirname+'/'+k+'.html',html);
const p=await b.newPage({viewport:{width:390,height:693},deviceScaleFactor:1080/390});await p.goto('file://'+__dirname+'/'+k+'.html');await p.waitForTimeout(1800);
await p.screenshot({path:__dirname+'/'+k+'.png'});execSync(`ffmpeg -loglevel error -y -i ${__dirname}/${k}.png -vf scale=1080:1920 -q:v 2 ${__dirname}/${k}-full.jpg`);console.log('ok',k);await p.close()}
await b.close()})();
