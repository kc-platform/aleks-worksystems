const projects = [
  { id: 'case-2', key: 'dbac', name: 'DBAC', url: 'https://dbac-quito-concept-2026.akd1357.chatgpt.site/' },
  { id: 'case-3', key: 'nora', name: 'Nora Operaciones Inmobiliarias', url: 'https://nora-quito-concept-2026.akd1357.chatgpt.site/' },
  { id: 'case-4', key: 'legartep', name: 'LEGARTEP Asesoría Legal', url: 'https://legartep-quito-concept-2026.akd1357.chatgpt.site/' },
  { id: 'case-1', key: 'arwt', name: 'Agent Ready Work Test (ARWT)', url: 'https://arwt.netlify.app/' }
];

export function renderProjects(copy, esc) {
  return `<section class="section projects" id="projects" aria-labelledby="projects-title">
    <div class="wrap split">
      <div class="intro"><h2 id="projects-title">${esc(copy.title)}</h2><p>${esc(copy.intro)}</p></div>
      <div class="project-list">
        ${projects.map(({ id, key, name, url }) => {
          const { type, description, link } = copy.items[key];
          return `<article id="${id}">
            <div><p class="project-type">${esc(type)}</p><h3>${esc(name)}</h3></div>
            <div><p>${esc(description)}</p><a class="text-link" href="${esc(url)}">${esc(link)}</a></div>
          </article>`;
        }).join('')}
      </div>
    </div>
  </section>`;
}
