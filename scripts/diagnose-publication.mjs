const base='https://bievolicitacoes-gules.vercel.app';
const now=Date.now();
for (const path of ['/', '/index.html','/release.json','/styles.css?v=bievo-mobilemotion-20261105-r8-whatsapp-final']) {
  const url=base+path+(path.includes('?')?'&':'?')+'freshcheck='+now;
  try{
    const response=await fetch(url,{cache:'no-store',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
    const html=await response.text();
    console.log(JSON.stringify({path,status:response.status,redirected:response.redirected,url:response.url,bytes:html.length,
      vercelCache:response.headers.get('x-vercel-cache'),vercelId:response.headers.get('x-vercel-id'),
      cacheControl:response.headers.get('cache-control'),age:response.headers.get('age'),
      revision:(html.match(/data-site-revision="([^"]+)/)||[])[1]||null,
      styleVersion:(html.match(/styles.css\?v=([^"]+)/)||[])[1]||null,
      nameSisto:html.includes('Fábio Henrique Sisto'),
      nameCisto:html.includes('Fábio Henrique Cisto'),
      whatsappSvg:html.includes('class="bievo-whatsapp-icon"'),
      oldFloatingImage:html.includes('<img src="favicon-bievo.png?v=2" alt="" width="48"'),
      cssWhatsApp:html.includes('.bievo-float-whatsapp .bievo-whatsapp-icon')
    }));
  }catch(e){console.log(JSON.stringify({path,error:String(e)}))}
}
