// Verificação real do endereço público para evitar deploys "verdes" com site antigo.
const url='https://bievolicitacoes-gules.vercel.app/release.json';
const wanted='bievo-motion-20261105-r2';
const attempts=8;
const pause=15000;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(let i=1;i<=attempts;i++){
  try {
    const response=await fetch(url+'?check='+Date.now(), {cache:'no-store',redirect:'follow',signal:AbortSignal.timeout(12000)});
    const text=await response.text();
    let result;
    try{result=JSON.parse(text)}catch{result={raw:text.slice(0,180)}}
    if(response.ok && result.release===wanted){
      console.log('PRODUÇÃO ATUALIZADA: '+url+' -> '+result.release);
      process.exit(0);
    }
    console.log('Tentativa '+i+'/'+attempts+': HTTP '+response.status+' release='+String(result.release??'indisponível')+' (esperado '+wanted+')');
  } catch(e){
    console.log('Tentativa '+i+'/'+attempts+': '+e.message);
  }
  if(i!==attempts)await sleep(pause);
}
console.error('ENDEREÇO PÚBLICO DESATUALIZADO. Verifique o alias/domain e a branch de produção na Vercel.');
process.exit(1);
