# Publicação da Bievo — versão V2

## Fonte oficial
O pacote de site enviado para revisão é `bievo-site-v2-revisado.zip`.
Ele contém `index.html`, `styles.css`, `script.js`, `site-config.js` e a pasta `assets/`.
A versão V2 usa apenas arquivos estáticos e pode ser publicada no GitHub Pages.

## Como finalizar a publicação
1. Extrair o ZIP e enviar o **conteúdo da pasta** `bievo-site-v2/` para a raiz da branch `main` (não enviar a pasta como subdiretório).
2. Garantir que `index.html`, estilos, scripts e todos os 10 recursos de `assets/` estejam no repositório.
3. Na tela do repositório, abrir **Settings → Pages → Build and deployment → Source** e escolher **GitHub Actions**.
4. O workflow `.github/workflows/deploy-pages.yml` deverá estar presente também em `main` e será executado nos novos commits.
5. Verificar a execução em **Actions** e validar o endereço que o GitHub Pages apresentar.
6. Conferir desktop e mobile, links de imagem, navegação e formulário.

## Antes do lançamento definitivo
- Confirmar e configurar o número oficial de WhatsApp em `site-config.js`; por padrão o formulário usa e-mail quando não há número.
- Confirmar o endereço de e-mail institucional e as informações de contato.
- Obter autorização para uso público de nomes e depoimentos dos clientes.
- Confirmar os direitos de uso das fotografias e mockups.
- Adicionar política de privacidade e revisar o tratamento de dados do formulário.

## Notas importantes
- **Não inventar métricas ou dados da empresa.** Os +10 anos de experiência pertencem ao CEO, e não à idade da Bievo.
- Não editar a copy aprovada, fontes e paleta sem revisão.
- Não publicar enquanto faltarem arquivos de imagem ou sem validar o endereço de produção.
