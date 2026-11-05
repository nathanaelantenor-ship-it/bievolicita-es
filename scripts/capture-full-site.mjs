import {chromium} from 'playwright';
import fs from 'node:fs';
const out='previews';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const targets=[
  {name:'WEB',filename:'Bievo-Site-Completo-WEB.png',width:1600,height:900,dpr:2,isMobile:false,hasTouch:false},
  {name:'MOBILE',filename:'Bievo-Site-Completo-MOBILE.png',width:430,height:880,dpr:2.5,isMobile:true,hasTouch:true}
];
const meta={capturedAt:new Date().toISOString(),baseUrl:'https://bievolicitacoes-gules.vercel.app/',captures:[]};
try {
 for(const target of targets){
  const context=await browser.newContext({
   viewport:{width:target.width,height:target.height},
   deviceScaleFactor:target.dpr,isMobile:target.isMobile,hasTouch:target.hasTouch,
   reducedMotion:'reduce',locale:'pt-BR',colorScheme:'light'
  });
  const page=await context.newPage();
  page.on('pageerror',e=>console.log('[PAGE ERROR]',target.name,e.message));
  const response=await page.goto('https://bievolicitacoes-gules.vercel.app/?preview=fullpage-r8',{waitUntil:'domcontentloaded',timeout:120000});
  if(!response?.ok())throw new Error(target.name+': status '+response?.status());
  await page.waitForLoadState('networkidle',{timeout:50000}).catch(()=>{});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1100);
  const rev=await page.locator('html').getAttribute('data-site-revision');
  if(!rev?.includes('bievo-mobilemotion'))throw new Error('Versão publicada inesperada: '+rev);
  // Carregamento progressivo dos elementos do site.
  await page.evaluate(async()=>{
   const step=Math.max(500,Math.floor(window.innerHeight*.8));
   const max=document.documentElement.scrollHeight;
   for(let y=0;y<max;y+=step){
     window.scrollTo(0,y);
     await new Promise(r=>setTimeout(r,120));
   }
   window.scrollTo(0,0);
  });
  await page.waitForTimeout(1500);
  await page.evaluate(()=>document.fonts.ready);
  const info=await page.evaluate(()=>({
   cssWidth:document.documentElement.scrollWidth,
   cssHeight:document.documentElement.scrollHeight,
   viewportWidth:innerWidth,
   missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src).slice(0,12),
   headings:[...document.querySelectorAll('h1,h2')].map(i=>i.textContent.trim()).slice(0,20)
  }));
  console.log('CAPTURE',target.name,JSON.stringify({rev,...info}));
  if(info.cssHeight < 4500)throw new Error('A página está incompleta: '+info.cssHeight);
  if(info.cssWidth > target.width+10)console.log('WARN: scroll horizontal',info.cssWidth,target.width);
  await page.screenshot({path:out+'/'+target.filename,type:'png',fullPage:true,animations:'disabled',caret:'hide',timeout:120000});
  meta.captures.push({name:target.name,...info,deviceScaleFactor:target.dpr,filename:target.filename});
  await context.close();
 }
 fs.writeFileSync(out+'/metadata.json',JSON.stringify(meta,null,2));
}finally{await browser.close();}
