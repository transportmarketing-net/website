import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_PATH = path.join(ROOT, 'sitepad-data', 'portfolio-projects.json');
const BASE_URL = 'https://transportmarketing.net/redstar';
const LASTMOD = '2026-08-27';

const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => escapeMap[char]);
}

function prettyDate(value) {
  return new Intl.DateTimeFormat('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00+03:00`));
}

function absoluteUrl(relativePath = '') {
  const cleanPath = relativePath.replace(/^\/+/, '');
  return cleanPath ? `${BASE_URL}/${cleanPath}` : `${BASE_URL}/`;
}

function jsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

function writeFile(relativePath, content) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function ensureRequiredImages() {
  const missing = projects
    .map((project) => project.image)
    .filter((imagePath) => !fs.existsSync(path.join(ROOT, imagePath)));

  if (missing.length > 0) {
    throw new Error(`Missing portfolio image assets:\n${missing.join('\n')}`);
  }
}

function siteHeader(prefix, active = '') {
  const navItems = [
    ['Αρχική', `${prefix}index.html`, 'home'],
    ['Υπηρεσίες', `${prefix}index.html#services`, 'services'],
    ['Portfolio', `${prefix}index.html#portfolio`, 'portfolio'],
    ['Blog', `${prefix}blog/index.html`, 'blog'],
    ['Επικοινωνία', `${prefix}contact/index.html`, 'contact']
  ];

  const nav = navItems
    .map(([label, href, key]) => `<a class="${active === key ? 'is-active' : ''}" href="${href}">${esc(label)}</a>`)
    .join('\n        ');

  return `<header class="rs-header">
    <a class="rs-logo" href="${prefix}index.html" aria-label="RedStar homepage">
      <img src="${prefix}sitepad-data/brand/logos/logo-full-color-light-bg.svg" alt="RedStar Digital Agency">
    </a>
    <nav class="rs-nav" aria-label="Primary navigation">
        ${nav}
    </nav>
  </header>`;
}

function siteFooter(prefix) {
  return `<footer class="rs-footer">
    <div>
      <strong>RedStar Digital Agency</strong>
      <span>Custom εφαρμογές, websites και αυτοματισμοί με παραγωγική τεχνική βάση.</span>
    </div>
    <a href="${prefix}contact/index.html">Συζητήστε το επόμενο project</a>
  </footer>`;
}

function commonHead({
  title,
  description,
  canonical,
  image,
  imageAlt,
  type = 'website',
  prefix = ''
}) {
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="icon" type="image/svg+xml" href="${prefix}sitepad-data/brand/favicons/favicon.svg">
  <meta property="og:locale" content="el_GR">
  <meta property="og:type" content="${esc(type)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="RedStar Digital Agency">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&subset=greek">`;
}

function commonCss(prefix) {
  return `<style>
    :root {
      --rs-red: #d62828;
      --rs-red-dark: #8f1111;
      --rs-red-soft: #fff1ee;
      --rs-ink: #17080a;
      --rs-muted: #665457;
      --rs-surface: #fff9f7;
      --rs-line: #ecd8d2;
      --rs-cream: #fff4ed;
      --rs-teal: #0f766e;
      --rs-blue: #213b7d;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      background: var(--rs-surface);
      color: var(--rs-ink);
      font-family: Inter, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.65;
      letter-spacing: 0;
    }

    a {
      color: inherit;
    }

    img {
      display: block;
      max-width: 100%;
    }

    .rs-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
      padding: 18px max(24px, calc((100% - 1180px) / 2));
      border-bottom: 1px solid var(--rs-line);
      background: rgba(255, 249, 247, 0.96);
      position: sticky;
      top: 0;
      z-index: 20;
      backdrop-filter: blur(14px);
    }

    .rs-logo {
      display: inline-flex;
      align-items: center;
      min-width: 178px;
      text-decoration: none;
    }

    .rs-logo img {
      width: 178px;
      height: auto;
    }

    .rs-nav {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
      font-weight: 700;
      color: var(--rs-muted);
    }

    .rs-nav a {
      min-height: 40px;
      padding: 9px 13px;
      border-radius: 8px;
      text-decoration: none;
    }

    .rs-nav a:hover,
    .rs-nav a:focus-visible,
    .rs-nav a.is-active {
      color: var(--rs-red-dark);
      background: var(--rs-red-soft);
      outline: none;
    }

    .rs-main {
      min-height: 70vh;
    }

    .rs-shell {
      width: min(1180px, calc(100% - 40px));
      margin: 0 auto;
    }

    .rs-hero {
      padding: 74px 0 54px;
      background:
        linear-gradient(120deg, rgba(23, 8, 10, 0.94), rgba(91, 8, 18, 0.86)),
        url("${prefix}sitepad-data/uploads/2026/05/redstar-space-crimson-nebula.jpg") center / cover;
      color: #fff9f7;
    }

    .rs-eyebrow {
      margin: 0 0 14px;
      color: #ff5b4d;
      font-size: 0.86rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    h1,
    h2,
    h3 {
      margin: 0;
      font-family: Manrope, Inter, Arial, sans-serif;
      letter-spacing: 0;
      line-height: 1.12;
    }

    h1 {
      max-width: 840px;
      font-size: 3.25rem;
      font-weight: 800;
    }

    h2 {
      font-size: 2rem;
      font-weight: 800;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 800;
    }

    .rs-lead {
      max-width: 760px;
      margin: 22px 0 0;
      color: rgba(255, 249, 247, 0.82);
      font-size: 1.08rem;
      font-weight: 500;
    }

    .rs-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }

    .rs-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 12px 18px;
      border: 1px solid var(--rs-red);
      border-radius: 8px;
      background: var(--rs-red);
      color: #fff;
      font-weight: 800;
      text-decoration: none;
    }

    .rs-button.secondary {
      border-color: rgba(255, 249, 247, 0.46);
      background: rgba(255, 249, 247, 0.08);
      color: #fff9f7;
    }

    .rs-button:hover,
    .rs-button:focus-visible {
      transform: translateY(-1px);
      outline: none;
    }

    .case-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
      padding: 44px 0 82px;
    }

    .case-card {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100%;
      overflow: hidden;
      border: 1px solid var(--rs-line);
      border-radius: 8px;
      background: #fff;
      text-decoration: none;
      box-shadow: 0 18px 46px rgba(23, 8, 10, 0.07);
      transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
    }

    .case-card:hover,
    .case-card:focus-visible {
      border-color: rgba(214, 40, 40, 0.42);
      box-shadow: 0 24px 58px rgba(23, 8, 10, 0.12);
      transform: translateY(-3px);
      outline: none;
    }

    .case-card__media {
      aspect-ratio: 16 / 10;
      padding: 10px;
      background: #1a0709;
    }

    .case-card__media img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: contain;
      object-position: center;
    }

    .case-card__body {
      display: grid;
      align-content: start;
      gap: 12px;
      padding: 22px;
    }

    .case-card__meta,
    .article-meta {
      color: var(--rs-red-dark);
      font-size: 0.78rem;
      font-weight: 800;
      line-height: 1.3;
      text-transform: uppercase;
    }

    .case-card__title {
      color: var(--rs-ink);
      font-family: Manrope, Inter, Arial, sans-serif;
      font-size: 1.45rem;
      font-weight: 800;
      line-height: 1.18;
    }

    .case-card__excerpt {
      margin: 0;
      color: var(--rs-muted);
      font-weight: 500;
    }

    .article-hero {
      padding: 58px 0 0;
      background:
        linear-gradient(120deg, rgba(23, 8, 10, 0.94), rgba(91, 8, 18, 0.84)),
        url("${prefix}sitepad-data/uploads/2026/05/redstar-space-crimson-nebula.jpg") center / cover;
      color: #fff9f7;
    }

    .article-hero__grid {
      display: grid;
      grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
      align-items: end;
      gap: 34px;
    }

    .article-hero h1 {
      font-size: 3rem;
    }

    .article-hero__copy {
      padding-bottom: 42px;
    }

    .article-figure {
      margin: 0;
      overflow: hidden;
      border: 1px solid rgba(255, 249, 247, 0.22);
      border-radius: 8px 8px 0 0;
      background: #130608;
      box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
    }

    .article-figure img {
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: contain;
      object-position: center;
      padding: 12px;
    }

    .article-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 310px;
      gap: 48px;
      padding: 58px 0 84px;
    }

    .article-content {
      display: grid;
      gap: 34px;
    }

    .article-content section {
      display: grid;
      gap: 16px;
    }

    .article-content p {
      margin: 0;
      color: var(--rs-muted);
      font-size: 1.02rem;
    }

    .article-content ul,
    .article-aside ul {
      display: grid;
      gap: 10px;
      margin: 0;
      padding-left: 20px;
      color: var(--rs-muted);
    }

    .article-content li,
    .article-aside li {
      padding-left: 4px;
    }

    .article-aside {
      position: sticky;
      top: 96px;
      align-self: start;
      display: grid;
      gap: 14px;
    }

    .article-panel {
      border: 1px solid var(--rs-line);
      border-radius: 8px;
      background: #fff;
      padding: 18px;
      box-shadow: 0 16px 40px rgba(23, 8, 10, 0.06);
    }

    .article-panel strong {
      display: block;
      margin-bottom: 4px;
      color: var(--rs-ink);
    }

    .article-panel span,
    .article-panel a {
      color: var(--rs-muted);
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .article-panel a:hover,
    .article-panel a:focus-visible {
      color: var(--rs-red-dark);
      outline: none;
    }

    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .article-tags span {
      padding: 6px 9px;
      border-radius: 8px;
      background: #eef8f6;
      color: var(--rs-teal);
      font-size: 0.78rem;
      font-weight: 800;
    }

    .related-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-top: 8px;
    }

    .related-link {
      display: grid;
      gap: 6px;
      padding: 18px;
      border: 1px solid var(--rs-line);
      border-radius: 8px;
      background: var(--rs-cream);
      text-decoration: none;
    }

    .related-link:hover,
    .related-link:focus-visible {
      border-color: rgba(214, 40, 40, 0.4);
      outline: none;
    }

    .related-link small {
      color: var(--rs-red-dark);
      font-weight: 800;
      text-transform: uppercase;
    }

    .related-link strong {
      font-family: Manrope, Inter, Arial, sans-serif;
      font-size: 1.05rem;
      line-height: 1.25;
    }

    .rs-footer {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding: 30px max(24px, calc((100% - 1180px) / 2));
      background: var(--rs-ink);
      color: #fff9f7;
    }

    .rs-footer div {
      display: grid;
      gap: 4px;
    }

    .rs-footer span {
      color: rgba(255, 249, 247, 0.72);
    }

    .rs-footer a {
      color: #fff9f7;
      font-weight: 800;
      text-decoration: none;
    }

    @media (max-width: 980px) {
      .rs-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .rs-nav {
        justify-content: flex-start;
      }

      h1,
      .article-hero h1 {
        font-size: 2.45rem;
      }

      .case-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .article-hero__grid,
      .article-layout {
        grid-template-columns: 1fr;
      }

      .article-aside {
        position: static;
      }
    }

    @media (max-width: 620px) {
      body {
        font-size: 15px;
      }

      .rs-header {
        padding: 16px 20px;
      }

      .rs-logo img {
        width: 150px;
      }

      .rs-nav {
        width: 100%;
        gap: 6px;
      }

      .rs-nav a {
        min-height: 38px;
        padding: 8px 10px;
      }

      .rs-shell {
        width: min(100% - 32px, 1180px);
      }

      .rs-hero {
        padding: 50px 0 38px;
      }

      h1,
      .article-hero h1 {
        font-size: 2.1rem;
      }

      h2 {
        font-size: 1.65rem;
      }

      .case-grid,
      .related-row {
        grid-template-columns: 1fr;
      }

      .article-hero {
        padding-top: 42px;
      }

      .article-hero__copy {
        padding-bottom: 28px;
      }

      .article-layout {
        gap: 34px;
        padding: 42px 0 58px;
      }

      .rs-footer {
        flex-direction: column;
        padding: 28px 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition: none !important;
      }

      .case-card:hover,
      .case-card:focus-visible,
      .rs-button:hover,
      .rs-button:focus-visible {
        transform: none;
      }
    }
  </style>`;
}

function portfolioSection() {
  const cards = projects
    .map((project, index) => {
      const number = String(index + 1).padStart(2, '0');
      return `        <a class="redstar-project-card" href="blog/${project.slug}/index.html" aria-label="${esc(project.title)} case study">
          <span class="redstar-project-card__media">
            <img src="${esc(project.image)}" alt="${esc(project.imageAlt)}" loading="lazy">
          </span>
          <span class="redstar-project-card__body">
            <span class="redstar-project-card__meta">${number} / ${esc(project.category)}</span>
            <span class="redstar-project-card__title">${esc(project.title)}</span>
            <span class="redstar-project-card__copy">${esc(project.excerpt)}</span>
            <span class="redstar-project-card__action">Δείτε case study <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
          </span>
        </a>`;
    })
    .join('\n');

  return `<!-- redstar-portfolio:start -->
<section id="portfolio" class="redstar-portfolio" aria-labelledby="redstar-portfolio-title">
  <div class="redstar-portfolio__inner">
    <div class="redstar-portfolio__header">
      <div class="redstar-portfolio__title-block">
        <p class="redstar-portfolio__eyebrow">Portfolio</p>
        <h2 id="redstar-portfolio-title">Πραγματικά Projects, Μετρήσιμα Αποτελέσματα</h2>
      </div>
      <p class="redstar-portfolio__intro">Ιστοσελίδες, SaaS εργαλεία και custom πλατφόρμες που δείχνουν καθαρά τι χτίστηκε, για ποιον, και με τι τεχνική βάση.</p>
      <div class="redstar-portfolio__controls" aria-label="Portfolio navigation">
        <button class="redstar-portfolio__control" type="button" data-portfolio-prev aria-label="Προηγούμενα projects">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <button class="redstar-portfolio__control" type="button" data-portfolio-next aria-label="Επόμενα projects">
          <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="redstar-portfolio__viewport">
      <div class="redstar-portfolio__track" data-portfolio-track aria-label="Portfolio projects">
${cards}
      </div>
    </div>
  </div>
</section>
<!-- redstar-portfolio:end -->`;
}

function replaceBetween(source, start, end, replacement) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return null;
  }

  return `${source.slice(0, startIndex)}${replacement}${source.slice(endIndex + end.length)}`;
}

function updateHomepage() {
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const generatedSection = portfolioSection();

  const markerReplace = replaceBetween(
    html,
    '<!-- redstar-portfolio:start -->',
    '<!-- redstar-portfolio:end -->',
    generatedSection
  );

  if (markerReplace) {
    html = markerReplace;
  } else {
    const nextHtml = html.replace(
      /<section id="portfolio" class="redstar-portfolio"[\s\S]*?<\/section>/,
      generatedSection
    );

    if (nextHtml === html) {
      throw new Error('Could not find homepage portfolio section to replace.');
    }

    html = nextHtml;
  }

  html = html.replace('#menu-item-69, #menu-item-71, .p-dxm127,', '#menu-item-71,');

  fs.writeFileSync(indexPath, html);
}

function blogIndexPage() {
  const prefix = '../';
  const title = 'Case Studies & SEO Blog | RedStar Digital Agency';
  const description = 'Πραγματικά RedStar projects με τεχνική ανάλυση, SEO στόχο, stack, παραγωγική βάση και links σε live websites και SaaS πλατφόρμες.';
  const canonical = absoluteUrl('blog/');
  const image = absoluteUrl('sitepad-data/uploads/2026/05/project-pediatric.png');

  const items = projects
    .map((project, index) => {
      const number = String(index + 1).padStart(2, '0');
      return `      <article>
        <a class="case-card" href="${project.slug}/index.html">
          <span class="case-card__media">
            <img src="${prefix}${esc(project.image)}" alt="${esc(project.imageAlt)}" loading="lazy">
          </span>
          <span class="case-card__body">
            <span class="case-card__meta">${number} / ${esc(project.category)} / ${esc(prettyDate(project.publishedAt))}</span>
            <span class="case-card__title">${esc(project.title)}</span>
            <p class="case-card__excerpt">${esc(project.excerpt)}</p>
          </span>
        </a>
      </article>`;
    })
    .join('\n');

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonical,
      inLanguage: 'el-GR',
      publisher: {
        '@type': 'Organization',
        name: 'RedStar Digital Agency',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('sitepad-data/brand/RedStar.png')
        }
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: project.title,
          url: absoluteUrl(`blog/${project.slug}/`)
        }))
      }
    }
  ];

  return `<!DOCTYPE html>
<html lang="el">
<head>
  ${commonHead({
    title,
    description,
    canonical,
    image,
    imageAlt: 'RedStar portfolio case studies',
    prefix
  })}
  ${commonCss(prefix)}
  <script type="application/ld+json">${jsonLd(schema)}</script>
</head>
<body>
  ${siteHeader(prefix, 'blog')}
  <main class="rs-main">
    <section class="rs-hero">
      <div class="rs-shell">
        <p class="rs-eyebrow">Case Studies</p>
        <h1>SEO blog pages για πραγματικά projects, όχι απλή γκαλερί screenshots.</h1>
        <p class="rs-lead">Κάθε project έχει δική του indexable σελίδα με business context, τεχνική βάση, SEO στόχο, structured data και σύνδεση προς το live έργο.</p>
      </div>
    </section>
    <section class="rs-shell case-grid" aria-label="RedStar project case studies">
${items}
    </section>
  </main>
  ${siteFooter(prefix)}
</body>
</html>
`;
}

function articlePage(project, index) {
  const prefix = '../../';
  const number = String(index + 1).padStart(2, '0');
  const canonical = absoluteUrl(`blog/${project.slug}/`);
  const image = absoluteUrl(project.image);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const keywords = [project.focusKeyword, project.category, project.title, ...project.stack.slice(0, 4)];

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: project.articleTitle,
      description: project.metaDescription,
      image,
      author: {
        '@type': 'Person',
        name: 'Alexandros Kourtis'
      },
      publisher: {
        '@type': 'Organization',
        name: 'RedStar Digital Agency',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('sitepad-data/brand/RedStar.png')
        }
      },
      datePublished: project.publishedAt,
      dateModified: LASTMOD,
      mainEntityOfPage: canonical,
      articleSection: 'Case Study',
      keywords,
      inLanguage: 'el-GR'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'RedStar',
          item: absoluteUrl('')
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Case Studies',
          item: absoluteUrl('blog/')
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.title,
          item: canonical
        }
      ]
    }
  ];

  const solutionItems = project.solution.map((item) => `<li>${esc(item)}</li>`).join('\n          ');
  const outcomeItems = project.outcomes.map((item) => `<li>${esc(item)}</li>`).join('\n          ');
  const stackItems = project.stack.map((item) => `<li>${esc(item)}</li>`).join('\n          ');
  const tags = keywords.slice(0, 6).map((item) => `<span>${esc(item)}</span>`).join('\n          ');

  return `<!DOCTYPE html>
<html lang="el">
<head>
  ${commonHead({
    title: project.metaTitle,
    description: project.metaDescription,
    canonical,
    image,
    imageAlt: project.imageAlt,
    type: 'article',
    prefix
  })}
  <meta property="article:published_time" content="${esc(project.publishedAt)}">
  <meta property="article:modified_time" content="${LASTMOD}">
  <meta property="article:section" content="Case Study">
  ${commonCss(prefix)}
  <script type="application/ld+json">${jsonLd(schema)}</script>
</head>
<body>
  ${siteHeader(prefix, 'blog')}
  <main class="rs-main">
    <article>
      <section class="article-hero">
        <div class="rs-shell article-hero__grid">
          <div class="article-hero__copy">
            <p class="rs-eyebrow">Case Study ${number}</p>
            <h1>${esc(project.articleTitle)}</h1>
            <p class="rs-lead">${esc(project.excerpt)}</p>
            <div class="rs-actions">
              <a class="rs-button" href="${esc(project.liveUrl)}" target="_blank" rel="noopener">Δείτε live project</a>
              <a class="rs-button secondary" href="${prefix}contact/index.html">Συζητήστε παρόμοιο project</a>
            </div>
          </div>
          <figure class="article-figure">
            <img src="${prefix}${esc(project.image)}" alt="${esc(project.imageAlt)}" fetchpriority="high">
          </figure>
        </div>
      </section>
      <div class="rs-shell article-layout">
        <div class="article-content">
          <section>
            <p class="article-meta">${esc(project.category)} / ${esc(prettyDate(project.publishedAt))}</p>
            <h2>Το project με μια ματιά</h2>
            <p>${esc(project.summary)}</p>
          </section>
          <section>
            <h2>Πρόκληση</h2>
            <p>${esc(project.challenge)}</p>
          </section>
          <section>
            <h2>Τι υλοποιήθηκε</h2>
            <ul>
          ${solutionItems}
            </ul>
          </section>
          <section>
            <h2>Τεχνική βάση</h2>
            <p>${esc(project.technical)}</p>
          </section>
          <section>
            <h2>SEO και περιεχόμενο</h2>
            <p>${esc(project.seo)}</p>
          </section>
          <section>
            <h2>Αποτέλεσμα</h2>
            <ul>
          ${outcomeItems}
            </ul>
          </section>
          <section>
            <h2>Σχετικά case studies</h2>
            <div class="related-row">
              <a class="related-link" href="../${prev.slug}/index.html">
                <small>Προηγούμενο</small>
                <strong>${esc(prev.title)}</strong>
              </a>
              <a class="related-link" href="../${next.slug}/index.html">
                <small>Επόμενο</small>
                <strong>${esc(next.title)}</strong>
              </a>
            </div>
          </section>
        </div>
        <aside class="article-aside" aria-label="Project details">
          <div class="article-panel">
            <strong>Project</strong>
            <span>${esc(project.title)}</span>
          </div>
          <div class="article-panel">
            <strong>Κατηγορία</strong>
            <span>${esc(project.category)}</span>
          </div>
          <div class="article-panel">
            <strong>Live URL</strong>
            <a href="${esc(project.liveUrl)}" target="_blank" rel="noopener">${esc(project.liveUrl)}</a>
          </div>
          <div class="article-panel">
            <strong>Stack</strong>
            <ul>
          ${stackItems}
            </ul>
          </div>
          <div class="article-panel">
            <strong>SEO focus</strong>
            <div class="article-tags">
          ${tags}
            </div>
          </div>
        </aside>
      </div>
    </article>
  </main>
  ${siteFooter(prefix)}
</body>
</html>
`;
}

function sitemapXml() {
  const urls = [
    ['', '1.0'],
    ['blog/', '0.9'],
    ['services/', '0.7'],
    ['about/', '0.7'],
    ['contact/', '0.7'],
    ['privacy/', '0.3'],
    ['terms/', '0.3'],
    ['cookies/', '0.3'],
    ...projects.map((project) => [`blog/${project.slug}/`, '0.82'])
  ];

  const body = urls
    .map(([relativePath, priority]) => `  <url>
    <loc>${absoluteUrl(relativePath)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Disallow: /site-admin/
Allow: /site-admin/admin-ajax.php
Sitemap: ${absoluteUrl('sitemap.xml')}
`;
}

function generate() {
  ensureRequiredImages();
  updateHomepage();
  writeFile('blog/index.html', blogIndexPage());
  projects.forEach((project, index) => {
    writeFile(`blog/${project.slug}/index.html`, articlePage(project, index));
  });
  writeFile('sitemap.xml', sitemapXml());
  writeFile('robots.txt', robotsTxt());

  console.log(`Generated ${projects.length} case studies, blog index, homepage portfolio, sitemap, and robots.txt.`);
}

generate();
