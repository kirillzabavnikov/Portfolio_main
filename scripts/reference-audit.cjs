const {chromium} = require('/opt/codex/cua_node/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
(async()=>{
 const trustPins=fs.readdirSync('/usr/local/share/ca-certificates').filter(n=>n.endsWith('.crt')).map(n=>{const cert=new crypto.X509Certificate(fs.readFileSync('/usr/local/share/ca-certificates/'+n));return crypto.createHash('sha256').update(cert.publicKey.export({format:'der',type:'spki'})).digest('base64')}).join(',');
 const browser = await chromium.launch({executablePath:'/usr/lib/chromium/chromium',headless:true,args:['--no-sandbox','--ignore-certificate-errors-spki-list='+trustPins],proxy:{server:process.env.HTTPS_PROXY}});
 for (const [name,width,height,url] of [
  ['home-desktop',1440,1000,'https://www.ivanzviahin.com/'],
  ['home-tablet',768,1024,'https://www.ivanzviahin.com/'],
  ['home-mobile',390,844,'https://www.ivanzviahin.com/'],
  ['case-desktop',1440,1000,'https://ivanzviahin.com/blog/all/feed/'],
  ['case-mobile',390,844,'https://ivanzviahin.com/blog/all/feed/']]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(1800);
  await page.screenshot({path:path.join(__dirname,'../research/reference-'+name+'.png')});
  console.log(name,await page.evaluate(()=>({bodyWidth:document.body.scrollWidth,title:[...document.querySelectorAll('h1')].map(e=>({text:e.innerText,rect:e.getBoundingClientRect().toJSON(),font:getComputedStyle(e).font})),blocks:[...document.querySelectorAll('.e2-text,.e2-note,.e2-note-text,.header,.main')].slice(0,5).map(e=>({class:e.className,rect:e.getBoundingClientRect().toJSON(),font:getComputedStyle(e).font,color:getComputedStyle(e).color}))})));
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
