# Bievo Licitações — Website institucional

Repositório oficial do projeto de website da **Bievo Licitações**.

## Objetivo
Desenvolver um site responsivo, profissional e orientado à geração de oportunidades comerciais para empresas privadas que desejam ingressar ou ampliar sua atuação em licitações públicas, com atenção especial ao setor industrial e atendimento em todo o Brasil.

## Diretrizes de marca
- **Identidade visual:** preservar logotipos e paleta de cores do manual da Bievo.
- **Cores:** azul `#041E41`, camel `#A68772`, off-white `#F6F3ED` e grafite `#2A3038`.
- **Tipografia do protótipo V2:** DM Sans e Playfair Display.
- **Pilares de comunicação:** estratégia, processo e resultado.
- **Copy:** a versão aprovada do protótipo V2 é a referência; não alterar textos sem revisão.
- **Conversão:** contato comercial, com integração de WhatsApp após confirmação do número oficial.

## Fluxo de trabalho
- `main`: base estável, mudanças mediante aprovação.
- `develop`: desenvolvimento e refinamentos.
- Commits pequenos e descritivos seguindo Conventional Commits (ex.: `feat:`, `fix:`, `style:`, `docs:`).
- Validar desktop, tablet, mobile, acessibilidade e funcionamento antes de preparar uma atualização para `main`.

## Situação
A versão consolidada do website está em `main`, com identidade visual Bievo, CTA direto para WhatsApp, mockups, SEO, Speed Insights, animações e ajustes responsivos. Release de interface: `bievo-mobilemotion-20261105-r8`.

Os testes de código e navegação (desktop/mobile) foram aprovados. **A presença do código em `main` não confirma o deploy da Vercel**: a publicação depende de um build bem-sucedido na integração do projeto.

## Publicação
- Site público: https://bievolicitacoes-gules.vercel.app/
- Repositório oficial: https://github.com/nathanaelantenor-ship-it/bievolicita-es
- Branch de produção: `main`.
- O último deploy consultado em 05/11/2026 falhou por limite de builds da conta Vercel. Após o limite ser liberado, publicar o HEAD de `main` e verificar a versão pública.
- GitHub Pages é uma alternativa opcional, mas precisa ser ativado pelo administrador em **Settings → Pages → Source: GitHub Actions** antes de executar o workflow de deploy.

O conteúdo principal, o logo, as cores e as fontes só devem mudar após aprovação do cliente.
