const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const phase = process.argv[2] || 'first';
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/lib/chromium/chromium',headless:true,args:['--no-sandbox']});
  const report=[];
  const routes=['/','/projects/gamification/','/projects/promocodes/','/projects/pulse/','/projects/editor/','/projects/comments/'];
  const dir=path.join(__dirname,'../research/qa-'+phase); fs.mkdirSync(dir,{recursive:true});
  for (const [width,height] of [[1440,1000],[768,1024],[390,844]]) {
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    for (const route of routes) {
      const response=await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,route);
      await page.evaluate(async()=>{
        document.querySelectorAll('img').forEach(img=>{img.loading='eager';});
        await Promise.all([...document.images].map(img=>img.decode()));
        await document.fonts.ready;
        window.scrollTo(0,0);
      });
      const state=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>window.innerWidth,
        missingImages:[...document.images].filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src),
        noAlt:[...document.images].filter(img=>!img.alt).length,
        h1:document.querySelectorAll('h1').length,
        title:document.title,
        description:document.querySelector('meta[name="description"]')?.content,
        og:document.querySelector('meta[property="og:image"]')?.content,
        bodyFont:getComputedStyle(document.body).font,
      }));
      assert.equal(state.overflow,false,`${width} ${route} horizontal overflow`);
      assert.equal(state.h1,1);assert.equal(state.noAlt,0);assert.equal(state.missingImages.length,0);assert.ok(state.description);assert.ok(state.og);
      const label=route==='/'?'home':route.split('/')[2];
      await page.screenshot({path:path.join(dir,`${label}-${width}.png`),fullPage:true});
      if(route==='/') await page.screenshot({path:path.join(dir,`home-top-${width}.png`)});
      report.push({width,route,...state});
    }
    if (width===390) {
      await page.goto('http://127.0.0.1:3000/');
      const button=page.getByRole('button',{name:'Открыть меню'});
      await button.click();
      await assert.doesNotReject(()=>page.getByRole('button',{name:'закрыть',exact:true}).waitFor({state:'visible'}));
      assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'hidden');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'закрыть');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Кирилл Забавников');
      await page.waitForTimeout(380); // Capture the final menu state after its 333ms transition.
      await page.screenshot({path:path.join(dir,'menu-mobile.png')});
      await page.keyboard.press('Escape');
      assert.equal(await button.getAttribute('aria-expanded'),'false');
      assert.equal(await button.evaluate(e=>document.activeElement===e),true);
      await button.click();
      await page.getByRole('link',{name:'Кирилл Забавников',exact:true}).click();
      assert.equal(await button.getAttribute('aria-expanded'),'false');
    }
    if (width===1440) {
      await page.goto('http://127.0.0.1:3000/');
      await page.locator('.project-cover').first().hover();
      await page.waitForTimeout(380);
      const transform=await page.locator('.project-cover > .project-visual, .project-cover > img').first().evaluate(e=>getComputedStyle(e).transform);
      assert.match(transform,/1\.02/);
      await page.emulateMedia({reducedMotion:'reduce'});
      const duration=await page.locator('.project-cover > .project-visual, .project-cover > img').first().evaluate(e=>getComputedStyle(e).transitionDuration);
      assert.equal(duration,'0s');
      // Verify an actual card click, not only direct route navigation.
      await page.locator('.project-cover').first().click();
      await page.waitForURL('**/projects/gamification/');
      await page.getByRole('link',{name:'Супермаркеты: промокоды →'}).click();
      await page.waitForURL('**/projects/promocodes/');
    }
    assert.deepEqual(errors,[],'Browser console errors');
    await page.close();
  }
  const page=await browser.newPage();
  const response=await page.goto('http://127.0.0.1:3000/404.html');
  assert.equal(response.status(),200); // Static output: host maps unknown URLs to this document.
  assert.ok(await page.getByRole('heading',{name:'Страница не найдена'}).count());
  fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));
  console.log(`PASS ${report.length} responsive pages; all images, metadata, menu focus, Escape, hover, reduced motion and card navigation.`);
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
