# Aleks Work Systems

Static, multilingual website for Aleks Karpov. English is at `/`, Spanish at `/es/`, and Russian at `/ru/`. The site is published through GitHub Pages at [kc-platform.github.io/aleks-worksystems](https://kc-platform.github.io/aleks-worksystems/).

## Build and check

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm run build
npm run check
```

The output is `dist/`. Set `SITE_URL` to a complete site root if the hosting address changes. The build emits 21 pages: three home pages and six standalone scenario pages in each language, with a sitemap, localized metadata and social previews.

## Architecture

- `src/content.mjs`: services, existing project descriptions, biography and base translations.
- `src/lab.mjs`: the six localized scenarios. Each has a slug, a service, a problem, an improvement, a verification criterion and fictional before/after records.
- `scripts/build.mjs`: generates all static pages. Routes are derived from scenario slugs.
- `src/assets/site.js`: keyboard accessible scenario selection, Clarity Switch, mobile menu and structured email preparation.
- `src/assets/styles.css`: visual system and responsive layouts.
- `scripts/make-og.ps1`: generates localized PNG previews on Windows. `src/assets/og.svg` is the vector reference.

To add a scenario, add one matching entry in each language in `src/lab.mjs`. Keep the same index across languages so language switching stays on the same subject. Provide fictional records only. Run the build and check commands, then review all three routes. To add a project to Evidence Room, update the projects in `src/content.mjs` and the corresponding decision and verification text in `scripts/build.mjs`. Label uncommissioned concepts clearly.

## Interaction and contact

The hero diagram and each Lab example have a Clarity Switch. The Lab shows a concrete four-column working record before and after, plus a written explanation and a way to verify the result. Every example has a direct URL for sharing. Scenario links open their standalone pages, so Back and language switching work with normal browser navigation.

The contact form prepares a `mailto:` message or copies its text. It does not send data to the site. The selected Lab scenario is carried into the draft. Email: `aleks.worksystems@gmail.com`. There are no analytics or tracking cookies.

## Publish

The GitHub Actions workflow in `.github/workflows/pages.yml` builds, checks and deploys every push to `main`. Commit and push to update the existing public address. See [QA.md](QA.md) for verification notes.

