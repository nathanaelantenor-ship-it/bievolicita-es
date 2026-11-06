// Confere o que o DOMÍNIO PÚBLICO está servindo, não o que está no GitHub.
// Essa verificação exige a release e os dois ajustes finais, impossibilitando falso positivo da R8.
const origin='https://bievolicitacoes-gules.vercel.app';
const release='bievo-final-whatsapp-20261105-r9';
const checks=[
  {
    "path": "/release.json",
    "tokens": [
      "\"release\": \"bievo-final-whatsapp-20261105-r9\""
    ]
  },
  {
    "path": "/",
    "tokens": [
      "data-site-revision=\"bievo-final-whatsapp-20261105-r9\"",
      "class=\"bievo-whatsapp-icon\"",
      "<strong>Fábio Henrique Sisto</strong>",
      "styles.css?v=bievo-final-whatsapp-20261105-r9",
      "script.js?v=bievo-final-whatsapp-20261105-r9",
      "typewriter.js?v=bievo-final-whatsapp-20261105-r9"
    ],
    "absent": [
      "<strong>Fábio Henrique Cisto</strong>",
      "<img src=\"favicon-bievo.png?v=2\" alt=\"\" width=\"48\""
    ]
  },
  {
    "path": "/styles.css?v=bievo-final-whatsapp-20261105-r9",
    "tokens": [
      ".bievo-float-whatsapp .bievo-whatsapp-icon{display:block;width:37px;height:37px",
      ".bievo-float-whatsapp .bievo-whatsapp-icon{width:31px;height:31px}"
    ]
  },
  {
    "path": "/typewriter.js?v=bievo-final-whatsapp-20261105-r9",
    "tokens": [
      "IntersectionObserver",
      "entry.intersectionRatio > 0"
    ]
  }
];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(let attempt=1;attempt<=8;attempt++){
  const errors=[];
  for(const check of checks){
    const url=origin+check.path+(check.path.includes('?')?'&':'?')+'fresh='+Date.now();
    try{
      const response=await fetch(url,{
        cache:'no-store',headers:{'Cache-Control':'no-cache'},
        signal:AbortSignal.timeout(12000)
      });
      const body=await response.text();
      const missing=check.tokens.filter(token=>!body.includes(token));
      const forbidden=(check.absent||[]).filter(token=>body.includes(token));
      const state={path:check.path,status:response.status,bytes:body.length,
        vercelCache:response.headers.get('x-vercel-cache'),age:response.headers.get('age'),
        missing,forbidden};
      console.log(JSON.stringify(state));
      if(!response.ok || missing.length || forbidden.length)errors.push(state);
    }catch(e){errors.push({path:check.path,error:String(e)});}
  }
  if(!errors.length){console.log('PUBLICAÇÃO FINAL CONFIRMADA NO DOMÍNIO: '+release);process.exit(0);}
  console.log('PENDENTE: site ainda não contém os ajustes finais, tentativa '+attempt+'/8');
  if(attempt<8)await sleep(15000);
}
console.error('FALHA DE PUBLICAÇÃO: release ou alterações finais ausentes na URL de produção. Verificar alias e build na Vercel.');
process.exit(1);
