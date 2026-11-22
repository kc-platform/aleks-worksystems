# Aleks Work Systems

Static, multilingual website for Aleks Karpov. English is at `/` (also available at `/en/`), Spanish at `/es/`, and Russian at `/ru/`. The site is published through GitHub Pages at [kc-platform.github.io/aleks-worksystems](https://kc-platform.github.io/aleks-worksystems/).

## Build and check

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm run build
npm run check
```

The output is `dist/`. To preview the build, run `node scripts/serve.mjs` and open `http://127.0.0.1:4173/`. Set `SITE_URL` to a complete site root if the hosting address changes. The sitemap lists three localized home pages and 18 standalone scenario pages. The English alias points to the same canonical home page.

## Architecture

- `src/home/`: shared template and assets, localized home content, Follow an Inquiry, and the standalone example layout.
- `src/lab.mjs`: the six localized scenarios. Each has a slug, a service, a problem, an improvement, a verification criterion and fictional before/after records.
- `scripts/build.mjs`: generates all static pages. Routes are derived from scenario slugs.
- `scripts/make-og.ps1`: generates localized PNG previews on Windows. `src/assets/og.svg` is the vector reference.

To add a scenario, add one matching entry in each language in `src/lab.mjs`. Keep the same index across languages so language switching stays on the same subject. Provide fictional records only. Run the build and check commands, then review all three routes.

## Interaction and contact

Follow an Inquiry uses one fictional WhatsApp message. Use Before to step through the dropped handoff. Use After to review the shared record, approve the clarification, and add a sample reply. Open the activity history to see what changed. Reset returns both views to their starting points. All demo actions run locally. The standalone Lab pages use the same Before and After controls to compare working records. Every Lab scenario keeps its direct URL.

The contact form prepares a `mailto:` message or copies its text. It does not send data to the site. On standalone Lab pages, the selected scenario is carried into the Lab draft. Email: `aleks.worksystems@gmail.com`. There are no analytics or tracking cookies.

## Publish

The GitHub Actions workflow in `.github/workflows/pages.yml` builds, checks and deploys every push to `main`. Commit and push to update the existing public address. See [QA.md](QA.md) for verification notes.
