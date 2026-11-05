import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const robots = readFileSync('robots.txt', 'utf8');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const site = 'https://bievolicitacoes-gules.vercel.app/';
const meta = (name) => html.match(new RegExp('<meta[^>]+name="'+name+'"[^>]+content="([^"]+)"', 'i'))?.[1] ?? '';
const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? '';
assert.match(title, /Bievo Licitações/);
assert(title.length < 65, 'Título SEO muito longo');
const description = meta('description');
assert(description.length >= 90 && description.length <= 160, 'Meta description deve conter entre 90 e 160 caracteres');
assert(html.includes('<link rel="canonical" href="'+site+'"/>'));
assert.match(meta('robots'), /index,follow/);
assert(html.includes('src="/_vercel/speed-insights/script.js"'));
assert(html.includes('<h1 id="hero-title">'));
assert(html.includes('O departamento de licitações da sua empresa'));
assert(robots.includes(site+'sitemap.xml'));
assert(sitemap.includes('<loc>'+site+'</loc>'));
assert.equal(pkg.dependencies['@vercel/speed-insights'], '2.0.0');
const ldjson = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert(ldjson, 'Dados estruturados ausentes');
const graph = JSON.parse(ldjson)['@graph'];
for (const type of ['Organization','WebSite','WebPage','Service','FAQPage']) {
 assert(graph.some(node=>node['@type']===type), 'Tipo de schema faltando: '+type);
}
const faqs=graph.find(n=>n['@type']==='FAQPage').mainEntity;
assert.equal(faqs.length,5);
for (const faq of faqs) {
 assert(html.includes(faq.name));
 assert(html.includes(faq.acceptedAnswer.text));
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados na página');
console.log('SEO e Speed Insights: verificações estáticas aprovadas.');
