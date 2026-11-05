import { chromium } from 'playwright';
const url=process.env.BIEVO_TEST_URL||'https://bievolicitacoes-gules.vercel.app/?e2e=typewriter-'+Date.now();
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox']});
for(const view of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
 const context=await browser.newContext({viewport:{width:view.width,height:view.height},reducedMotion:'no-preference'});
 const page=await context.newPage();
 const errors=[],network=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(/typewriter\.js/.test(r.url()))network.push({url:r.url(),status:r.status()})});
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
 await page.waitForTimeout(2000);
 const svgArrows=await page.locator('.bievo-arrow-icon').count();
 if(svgArrows!==10)throw Error('Setas vetoriais ausentes '+view.name+': '+svgArrows);
 if(view.name==='mobile'){
   const geometry=await page.evaluate(()=>{
     const hero=document.querySelector('.hero').getBoundingClientRect();
     const photo=document.querySelector('.hero-visual').getBoundingClientRect();
     const img=document.querySelector('.hero-visual>img');
     return {top:Math.abs(photo.top-hero.top),bottom:Math.abs(photo.bottom-hero.bottom),
       width:Math.abs(photo.width-hero.width),height:Math.abs(photo.height-hero.height),
       fit:getComputedStyle(img).objectFit};
   });
   if(geometry.top>2||geometry.bottom>2||geometry.width>2||geometry.height>2||geometry.fit!=='cover')
      throw Error('Imagem da Home não cobre toda a área mobile: '+JSON.stringify(geometry));
 }
 const data={view:view.name,version:await page.locator('html').getAttribute('data-site-revision'),reducedMotion:await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),errors,network,headings:[]};
 for(const id of ['opp-title','method-title','faq-title']){
   const locator=page.locator('#'+id);
   await locator.scrollIntoViewIfNeeded();
   await page.waitForTimeout(1300);
   let first=await locator.evaluate(e=>({state:e.dataset.typewriterState,txt:e.querySelector('.typing-output')?.textContent||null,full:e.textContent.slice(0,80),display:getComputedStyle(e.querySelector('.typing-output')||e).display,rect:Math.round(e.getBoundingClientRect().top)}));
   await page.waitForTimeout(1350);
   let later=await locator.evaluate(e=>({state:e.dataset.typewriterState,txt:e.querySelector('.typing-output')?.textContent||null,full:e.textContent.slice(0,80)}));
   data.headings.push({id,first,later});
   if(first.state!=='typing'||!first.txt||!later.txt||later.txt.length<=first.txt.length)throw Error('Digitação falhou '+view.name+' '+id+' '+JSON.stringify({first,later}));
   await locator.click();
   await page.waitForTimeout(590);
   const replay=await locator.evaluate(e=>({state:e.dataset.typewriterState,txt:e.querySelector('.typing-output')?.textContent||null}));
   if(replay.state!=='typing'||!replay.txt)throw Error('Replay por clique falhou '+view.name+' '+id+' '+JSON.stringify(replay));
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForTimeout(450);
 }
 console.log('BROWSER_DIAGNOSTIC',JSON.stringify(data));
 await context.close();
}
await browser.close();
