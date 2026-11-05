import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const html=readFileSync('index.html','utf8');
const code=readFileSync('typewriter.js','utf8');
const dom=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only',url:'https://bievolicitacoes-gules.vercel.app/'});
const {window}=dom;
window.matchMedia=()=>({matches:false,addEventListener(){}});
const observed=[];
window.IntersectionObserver=class{
  constructor(cb){this.cb=cb;observed.push(this);}
  observe(){} disconnect(){}
};
window.eval(code);
assert.equal(observed.length,1,'Deve haver um observador de entrada de viewport');
const ids=['opp-title','method-title','faq-title'];
const headings=ids.map(id=>window.document.getElementById(id));
const originals=headings.map(h=>h.textContent);
for(const heading of headings){
  observed[0].cb([{target:heading,isIntersecting:true,intersectionRatio:.6}]);
  assert.equal(heading.dataset.typewriterState,'idle',heading.id+' deve aguardar o centro da viewport');
  assert(heading.querySelector('.typing-ghost'),heading.id+' perdeu reserva de altura');
  assert(heading.querySelector('.typing-caret'),heading.id+' não tem cursor');
}
await new Promise(resolve=>setTimeout(resolve,1150));
for(const heading of headings)assert.equal(heading.dataset.typewriterState,'typing',heading.id+' não iniciou após a pausa');
for(let i=0;i<headings.length;i++){
  const heading=headings[i];
  const output=heading.querySelector('.typing-output');
  assert(output,'Saída ausente: '+heading.id);
  assert(output.textContent.length>3,'Não digitou caracteres: '+heading.id);
  assert(output.textContent.length<originals[i].length,'Exibiu a frase inteira cedo: '+heading.id);
}
for(const heading of headings){
  observed[0].cb([{target:heading,isIntersecting:false,intersectionRatio:0}]);
  assert.equal(heading.dataset.typewriterState,'idle','Saída não rearmou '+heading.id);
  assert(!heading.querySelector('.typing-output'),'Título não voltou ao texto normal');
  observed[0].cb([{target:heading,isIntersecting:true,intersectionRatio:.65}]);
  assert.equal(heading.dataset.typewriterState,'idle','Entrada repetida deve aguardar a pausa: '+heading.id);
}
await new Promise(resolve=>setTimeout(resolve,670));
for(const heading of headings)assert.equal(heading.dataset.typewriterState,'typing','Replay por scroll não iniciou: '+heading.id);
for(const heading of headings)observed[0].cb([{target:heading,isIntersecting:false,intersectionRatio:0}]);
const faq=headings[2];
assert.equal(faq.querySelectorAll('br').length,0,'FAQ ganhou quebra de linha indevida');
assert.equal(faq.textContent,originals[2],'FAQ teve copy alterada');
dom.window.close();
const reduced=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only'});
reduced.window.matchMedia=()=>({matches:true,addEventListener(){}});
reduced.window.eval(code);
assert.equal(reduced.window.document.getElementById('faq-title').textContent,originals[2]);
reduced.window.document.getElementById('faq-title').click();
assert.equal(reduced.window.document.getElementById('faq-title').dataset.typewriterState,'typing','Clique explícito deve iniciar mesmo com reduced motion');
reduced.window.close();
console.log('Digitação validada nos três títulos, replay, FAQ sem quebra forçada e movimento reduzido.');
