# Aleks Work Systems

Static, multilingual website for Aleks Karpov. English is at `/` (also available at `/en/`), Spanish at `/es/`, and Russian at `/ru/`. The site is published through GitHub Pages at [kc-platform.github.io/aleks-worksystems](https://kc-platform.github.io/aleks-worksystems/).

## Build and check

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm run build
npm run check
```

The output is `dist/`. Set `SITE_URL` to a complete site root if the hosting address changes. The sitemap lists three localized home pages and 18 standalone scenario pages. The English alias points to the same canonical home page.

## Architecture

- `src/home/`: localized home pages, the animated inquiry comparison and its assets.
- `src/content.mjs`: services, project descriptions, biography and base translations for the standalone scenario pages.
- `src/lab.mjs`: the six localized scenarios. Each has a slug, a service, a problem, an improvement, a verification criterion and fictional before/after records.
- `scripts/build.mjs`: generates all static pages. Routes are derived from scenario slugs.
- `src/assets/site.js`: keyboard accessible scenario selection, Clarity Switch, mobile menu and structured email preparation.
- `src/assets/styles.css`: visual system and responsive layouts.
- `scripts/make-og.ps1`: generates localized PNG previews on Windows. `src/assets/og.svg` is the vector reference.

To add a scenario, add one matching entry in each language in `src/lab.mjs`. Keep the same index across languages so language switching stays on the same subject. Provide fictional records only. Run the build and check commands, then review all three routes. To add a project to Evidence Room, update the projects in `src/content.mjs` and the corresponding decision and verification text in `scripts/build.mjs`. Label uncommissioned concepts clearly.

## Interaction and contact

The home page compares two outcomes of the same inquiry. Use the Messages or Website form option, pause the comparison, or select an individual step. The standalone Lab pages use the Clarity Switch to compare working records before and after. Every Lab scenario keeps its direct URL.

The contact form prepares a `mailto:` message or copies its text. It does not send data to the site. The selected Lab scenario is carried into the draft. Email: `aleks.worksystems@gmail.com`. There are no analytics or tracking cookies.

## Publish

The GitHub Actions workflow in `.github/workflows/pages.yml` builds, checks and deploys every push to `main`. Commit and push to update the existing public address. See [QA.md](QA.md) for verification notes.

