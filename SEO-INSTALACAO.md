# SEO e Speed Insights — Bievo Licitações

## Estrutura do projeto
Este site é HTML/CSS/JavaScript estático, sem framework ou bundler. O package.json declara `@vercel/speed-insights@2.0.0`. Para usar npm em ambiente Node, execute `npm install`. A versão publicada usa a integração oficial para sites estáticos: `/_vercel/speed-insights/script.js`, evitando migrar o projeto de framework e criar JavaScript desnecessário.

## Ativação na Vercel
1. No projeto correspondente ao domínio público, abra **Speed Insights** e clique em **Enable**.
2. Publique a branch `main` na Vercel. O script só recebe eventos onde o endpoint `/_vercel/speed-insights/script.js` é servido.
3. Verifique o carregamento do script e eventos no painel após acessos reais. O pacote não garante velocidade; ele mede Core Web Vitals.
4. O SEO técnico pode ser conferido localmente com `npm run check:seo`, sem depender de rede.

## Domínio e indexação
O domínio canônico provisório é https://bievolicitacoes-gules.vercel.app/. **Quando o domínio final da empresa for configurado**, atualize em conjunto os links canonical, og:url, imagens sociais, JSON-LD, robots.txt e sitemap.xml. Mantenha somente o domínio principal indexável e redirecione domínios alternativos.

Conecte o domínio ao Google Search Console, faça a verificação de propriedade e envie `https://bievolicitacoes-gules.vercel.app/sitemap.xml`. Verifique indexação e Core Web Vitals, de preferência com dados móveis reais. A presença de sitemap e schema não garante posições ou rich results.

## Qualidade e conteúdo
- Título, descrição, Open Graph e Twitter Card foram ajustados para os serviços e a atuação nacional reais.
- Dados estruturados: empresa, site, página, serviço e FAQs correspondentes ao conteúdo visível.
- Imagens abaixo da dobra continuam com lazy loading; a capa mantém prioridade alta e agora recebe dimensões declaradas.
- Copy, serviços, identidade visual, cores, fotografias e CTAs comerciais foram preservados.
- Fotos hospedadas no Googleusercontent ainda dependem do servidor externo. Migrá-las futuramente para arquivos WebP/AVIF locais e dimensionados pode melhorar estabilidade e LCP após testes.
- Não foram usados rankings, avaliações artificiais nem números de contratos não verificados.
