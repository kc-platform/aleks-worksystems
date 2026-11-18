# Redesign quality review

## Starting point

The previous version explained the services clearly but relied on static cards. Its four situation cards did not show a working system, and the portfolio described projects without a consistent problem, decision and verification structure. The former hero placed a large portrait alongside the offer; the portrait now appears in About, while the first screen demonstrates the work.

## Design decisions

The new first screen states the offer and shows a before/after working diagram. A compact service strip identifies the four commercial services without requiring interaction. The Lab uses fictional but recognizable records, with terracotta for friction and green for organized states, plus labels and text. Evidence Room separates an observed need, proposed response and check for each existing project. The project status remains explicit; no client result or testimonial is invented.

The contact section composes an email and provides a copy option. It never claims a message was sent. The existing portrait and Aleks supplied About copy remain in place.

## Automated checks

Run `npm run build` and `npm run check`. The checker covers 21 generated routes, three languages, six scenarios, main section anchors, local assets, canonical and alternate URLs, and the sitemap. This is a static integrity check, not a substitute for browser testing.

## Browser review

The in-app browser backend was unavailable during local review. Browser checks and screenshots should be completed against the public deployment. Check the hero switch, each Lab switch, all six tabs, Back, language switching on a scenario, the mobile menu, the email draft and copy fallback at 390, 768 and 1440 px. Record any observed issues and fix them before calling the redesign verified.

## Performance and accessibility

The site has no external scripts, CSS frameworks, fonts or analytics. Images are local; the portrait is lazy-loaded below the first screen. Reduced motion is respected, controls have visible focus, and interactions have readable static alternatives. Lighthouse scores and field Web Vitals have not been measured; no numerical performance claim should be made without a run.

## Known limits

Evidence Room uses existing independent tools and concepts, with design hypotheses and manual verification suggestions. It is not a record of measured commercial outcomes. The contact form depends on the visitor's email application or clipboard permission. The project does not have server-side form handling.
