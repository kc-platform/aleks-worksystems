# Aleks Work Systems

A lightweight, multilingual business website for Aleks Karpov. English is the default at `/`; Spanish and Russian live at `/es/` and `/ru/`.

## Build

Requires Node.js 22 or newer. There are no third-party runtime or build dependencies.

```sh
npm run build
npm run check
```

The generated site is in `dist/`. The source text is in `src/content.mjs`, styles and small assets are in `src/assets/`, and the generator is `scripts/build.mjs`.

Set `SITE_URL` when building for a different public address. It must be the complete URL of the site root, including a GitHub Pages project subpath and trailing slash. For example:

```sh
SITE_URL=https://USERNAME.github.io/aleks-worksystems/ npm run build
```

On PowerShell:

```powershell
$env:SITE_URL = 'https://USERNAME.github.io/aleks-worksystems/'
npm run build
Remove-Item Env:SITE_URL
```

The default build URL is `https://kc-platform.github.io/aleks-worksystems/`. Local links and assets use relative URLs and work under the project subpath.

## Publish with GitHub Pages

The public repository is [kc-platform/aleks-worksystems](https://github.com/kc-platform/aleks-worksystems). GitHub Pages is configured to use GitHub Actions. The workflow in `.github/workflows/pages.yml` builds, checks and deploys the site on every push to `main`.

The public site is at [https://kc-platform.github.io/aleks-worksystems/](https://kc-platform.github.io/aleks-worksystems/), with Spanish at `/es/` and Russian at `/ru/`. To publish a change, commit it and push `main`, then confirm the workflow under **Actions**.

The GitHub Actions workflow sets `SITE_URL` from the repository owner automatically. If the repository name changes, update its path in `.github/workflows/pages.yml` and rebuild. For a future custom domain, set `SITE_URL` to that domain and add the domain in GitHub Pages settings.

## Content and contact

The enquiry route is a prefilled `mailto:` link. It opens the visitor's email application; no data is submitted to this website, and there is no hidden contact backend. The four external examples were opened and reviewed on 2026-11-16. The three company concepts are identified on this site and on their own pages as independent demonstrations, not official or commissioned projects.

The About section uses the biography and experience figures supplied by Aleks. Before broad promotion, he should confirm the contact address, LinkedIn profile, and comfort with showing the three concept examples. The hero uses an edited version of the portrait he supplied. The circular mask and embedded branding were removed to make a clean rectangular photograph for the site.

## Design and accessibility

The design uses an off-white background, dark green primary actions, restrained pale green accents, a rectangular editorial portrait, Georgia for headings, and the system sans-serif stack for UI and body copy. Layouts switch from two columns to one column at mobile widths. The site includes a skip link, semantic landmarks, visible focus, reduced-motion support, translated mobile navigation labels, language-specific metadata, `hreflang`, Open Graph tags, a sitemap and `robots.txt`. It contains no analytics or tracking scripts.

The initial release was checked in a browser at 1440, 1024, 768, 390 and 360 px in each language. There was no horizontal overflow or missing image. The mobile menu and RU→EN language switch were exercised. The portrait revision was visually reviewed at 1440 px in English, 768 px in Russian and 500 px in Russian. Lighthouse scores were not measured.

See [QA.md](QA.md) for the review record and current verification limits. The three Open Graph preview PNGs can be regenerated on Windows with `./scripts/make-og.ps1`.
Screenshots of the updated site build are in [`screenshots/`](screenshots/).
