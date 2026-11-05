import { chromium } from 'playwright';
const url='https://bievolicitacoes-gules.vercel.app/?e2e=typewriter-'+Date.now();
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox']});
for(const view of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
 const context=await browser.newContext({viewport:{width:view.width,height:view.height},reducedMotion:'no-preference'});
 const page=await context.newPage();
 const errors=[],network=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(/typewriter\.js/.test(r.url()))network.push({url:r.url(),status:r.status()})});
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
 await page.waitForTimeout(2000);
 const data={view:view.name,version:await page.locator('html').getAttribute('data-site-revision'),reducedMotion:await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),errors,network,headings:[]};
 for(const id of ['opp-title','method-title','faq-title']){
   const locator=page.locator('#'+id);
   await locator.scrollIntoViewIfNeeded();
   await page.waitForTimeout(750);
   let first=await locator.evaluate(e=>({state:e.dataset.typewriterState,txt:e.querySelector('.typing-output')?.textContent||null,full:e.textContent.slice(0,80),display:getComputedStyle(e.querySelector('.typing-output')||e).display,rect:Math.round(e.getBoundingClientRect().top)}));
   await page.waitForTimeout(1350);
   let later=await locator.evaluate(e=>({state:e.dataset.typewriterState,txt:e.querySelector('.typing-output')?.textContent||null,full:e.textContent.slice(0,80)}));
   data.headings.push({id,first,later});
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForTimeout(450);
 }
 console.log('BROWSER_DIAGNOSTIC',JSON.stringify(data));
 await context.close();
}
await browser.close();
