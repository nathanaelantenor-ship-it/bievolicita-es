// Verifica o HTML, CSS e JavaScript realmente servidos no domínio público.
// A Vercel pode informar deploy "Ready" enquanto um domínio ainda entrega código antigo.
const origin='https://bievolicitacoes-gules.vercel.app';
const release='bievo-about-20261105-r7';
const checks=[
  {path:'/release.json',tokens:['"release": "'+release+'"']},
  {path:'/',tokens:['data-site-revision="'+release+'"','class="audience-card motion-card"','class="service motion-card"','class="testimonial featured motion-card"','styles.css?v='+release,'script.js?v='+release,'typewriter.js?v='+release,'id="opp-title" data-typewriter="scroll" tabindex="0"','id="method-title" data-typewriter="scroll" tabindex="0"','id="faq-title" data-typewriter="scroll" tabindex="0"']},
  {path:'/styles.css?v='+release,tokens:['bievo-hero-breathe','--hero-zoom:1.023','.typing-title','--motion-photo','bievo-purpose-reveal','.about-text .signature{margin-top:auto']},
  {path:'/script.js?v='+release,tokens:['touch.matches','is-active']},
  {path:'/typewriter.js?v='+release,tokens:['IntersectionObserver','typing-ghost','typewriterState','method-title','opp-title','faq-title','112','entryTimer','addEventListener','entry.intersectionRatio >= .42']}
];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const attempts=8;
for(let attempt=1;attempt<=attempts;attempt++){
  const errors=[];
  for(const check of checks){
    const url=origin+check.path+(check.path.includes('?')?'&':'?')+'livecheck='+Date.now();
    try{
      const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});
      const body=await response.text();
      if(check.path==='/' && body.includes('class="corner-label"'))errors.push(check.path+' frase removida ainda presente');
      if(!response.ok)errors.push(check.path+' HTTP '+response.status);
      else for(const token of check.tokens){
        if(!body.includes(token))errors.push(check.path+' falta '+JSON.stringify(token));
      }
      if(response.ok&&!errors.some(e=>e.startsWith(check.path)))console.log('OK '+check.path+' (HTTP '+response.status+', bytes '+body.length+')');
    }catch(error){errors.push(check.path+' '+String(error.message));}
  }
  if(!errors.length){console.log('PUBLICAÇÃO CONFIRMADA — HTML, CSS e JS da Bievo estão atualizados no domínio: '+origin);process.exit(0);}
  console.log('Tentativa '+attempt+'/'+attempts+' — pendências: '+errors.join('; '));
  if(attempt<attempts)await wait(15000);
}
console.error('Site público não está entregando as animações esperadas; revise o domínio/branch/configuração Vercel.');
process.exit(1);
