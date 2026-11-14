// One project order and card renderer for the homepage and portfolio.
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const external = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M19 13v6H5V5h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function orderedProjects(projects) {
  return projects.toSorted((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity));
}

export function categoryFor(project) {
  if (['websites', 'commerce', 'platforms'].includes(project.filterCategory)) return project.filterCategory;
  const value = `${project.category} ${project.title}`.toLowerCase();
  if (value.includes('shop') || value.includes('retail')) return 'commerce';
  return value.includes('platform') || value.includes('saas') ? 'platforms' : 'websites';
}

export function displayCategory(project) {
  return { websites: 'Ιστοσελίδα', commerce: 'E-shop', platforms: 'Εφαρμογή' }[categoryFor(project)];
}

export function projectImage(project, prefix = '', detail = false) {
  const responsive = project.imageSmall ? ` srcset="${esc(prefix + project.imageSmall)} 720w, ${esc(prefix + project.image)} 1440w" sizes="${detail ? '(min-width: 1200px) 1180px, 100vw' : '(min-width: 1200px) 480px, (min-width: 768px) 45vw, 90vw'}"` : '';
  return `<img src="${esc(prefix + project.image)}"${responsive} alt="${esc(project.imageAlt || project.title)}" width="${project.imageWidth || 1440}" height="${project.imageHeight || 900}" loading="${detail ? 'eager' : 'lazy'}" decoding="async">`;
}

export function projectCard(project, index, home = false) {
  const prefix = home ? '' : '../';
  const detail = `${home ? 'portfolio/' : ''}${project.slug}/index.html`;
  const klass = home ? 'redstar-project-card' : 'case-card';
  const media = home ? 'redstar-project-card__media' : 'case-card__img';
  const body = home ? 'redstar-project-card__body' : 'case-card__body';
  const title = home ? 'redstar-project-card__title' : 'case-card__title';
  const meta = home ? 'redstar-project-card__meta' : 'case-card__meta';
  const copy = home ? 'redstar-project-card__copy' : 'case-card__excerpt';
  return `<article class="${klass}" data-project="${esc(project.slug)}" data-category="${categoryFor(project)}"${project.featuredOrder ? ' data-featured="true"' : ''}>
    <a class="portfolio-card__main" href="${detail}" aria-label="Δείτε το έργο ${esc(project.title)}">
      <span class="${media}">${projectImage(project, prefix)}</span>
      <div class="${body}">
        <span class="${meta}">${home ? String(index + 1).padStart(2, '0') + ' / ' : ''}${esc(displayCategory(project))}</span>
        <h${home ? '3' : '2'} class="${title}">${esc(project.title)}</h${home ? '3' : '2'}>
        <span class="${copy}">${esc(project.excerpt)}</span>
        <span class="portfolio-card__detail">Δείτε το έργο <span aria-hidden="true">→</span></span>
      </div>
    </a>
    ${project.liveUrl ? `<a class="portfolio-card__live" href="${esc(project.liveUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Προβολή ιστοσελίδας ${esc(project.title)} (νέα καρτέλα)">Προβολή ιστοσελίδας ${external}</a>` : ''}
  </article>`;
}

export function homepagePortfolio(projects) {
  return `<!-- redstar-portfolio:start -->
<link rel="stylesheet" href="assets/css/portfolio.css">
<section id="portfolio" class="redstar-portfolio" aria-labelledby="redstar-portfolio-title">
  <div class="redstar-portfolio__inner">
    <div class="redstar-portfolio__header">
      <div class="redstar-portfolio__title-block"><p class="redstar-portfolio__eyebrow">Portfolio</p><h2 id="redstar-portfolio-title">Επιλεγμένα έργα</h2></div>
      <p class="redstar-portfolio__intro">Ιστοσελίδες, e-shop και εφαρμογές. Δείτε κάθε έργο και επισκεφθείτε την ιστοσελίδα του.</p>
      <div class="redstar-portfolio__controls" aria-label="Πλοήγηση έργων">
        <button class="redstar-portfolio__control" type="button" data-portfolio-prev aria-label="Προηγούμενα έργα"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button class="redstar-portfolio__control" type="button" data-portfolio-next aria-label="Επόμενα έργα"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
      </div>
    </div>
    <div class="redstar-portfolio__viewport"><div class="redstar-portfolio__track" data-portfolio-track aria-label="Έργα RedStar">
      ${orderedProjects(projects).map((project, index) => projectCard(project, index, true)).join('\n')}
    </div></div>
  </div>
</section>
<!-- redstar-portfolio:end -->`;
}

export function refreshHomepagePortfolio(html, projects) {
  const pattern = /<!-- redstar-portfolio:start -->[\s\S]*?<!-- redstar-portfolio:end -->/;
  if (!pattern.test(html)) throw new Error('Homepage portfolio markers missing');
  return html.replace(pattern, () => homepagePortfolio(projects));
}

export function mergePortfolioSitemap(xml, projects, canonicalRoot) {
  const existing = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
  const additions = ['/portfolio/', ...projects.map(project => `/portfolio/${project.slug}/`)]
    .map(route => canonicalRoot + route).filter(url => !existing.has(url));
  if (!xml.includes('</urlset>')) throw new Error('Existing sitemap missing urlset');
  return xml.replace('</urlset>', additions.map(url => `  <url><loc>${esc(url)}</loc></url>\n`).join('') + '</urlset>');
}
