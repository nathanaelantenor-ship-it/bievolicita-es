import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox']});
for(const size of [{w:1704,h:864},{w:1280,h:800},{w:1024,h:768},{w:768,h:900},{w:390,h:844}]){
 const context=await browser.newContext({viewport:{width:size.w,height:size.h},deviceScaleFactor:1});
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(350);
 const info=await page.evaluate(()=>{
  const box=sel=>{const r=document.querySelector(sel).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
  return {photo:box('.about-photo'),img:box('.about-photo img'),title:box('.about-text h2'),text:box('.about-text'),signature:box('.signature'),grid:box('.about-grid'),css:{font:getComputedStyle(document.querySelector('.about-text h2')).fontSize,columns:getComputedStyle(document.querySelector('.about-grid')).gridTemplateColumns}};
 });
 const round=n=>Math.round(n*10)/10;
 const data={size:size.w,photoTop:round(info.photo.top),titleTop:round(info.title.top),photoBottom:round(info.photo.bottom),signatureBottom:round(info.signature.bottom),photoWidth:round(info.photo.width),textWidth:round(info.text.width),titleFont:info.css.font,columns:info.css.columns};
 console.log('ABOUT_LAYOUT',JSON.stringify(data));
 assert(info.photo.width>0 && info.text.width>0 && info.img.height>0,'Coluna vazia em '+size.w);
 if(size.w>960){
  assert.equal(Math.round(info.photo.bottom),Math.round(info.signature.bottom),'Foto e assinatura desalinhadas em '+size.w);
  assert(Math.abs(info.photo.top-info.title.top)<40,'Foto não inicia junto ao título em '+size.w);
  assert(info.photo.width>info.text.width*1.38,'Foto perdeu proporção 3/5 em '+size.w);
  assert(info.title.height<info.photo.height*.72,'Título alto demais em relação à foto em '+size.w);
 }else{
  assert(info.photo.bottom < info.title.top,'Foto mobile deve ficar acima do texto '+size.w);
  assert(info.title.bottom < info.signature.top,'Título e assinatura não devem se sobrepor '+size.w);
 }
 await context.close();
}
await browser.close();
console.log('LAYOUT_BIEVO_OK: retrato e texto proporcionais em desktop, tablet e mobile');
