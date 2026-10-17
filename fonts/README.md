# Fonts

Brand font files. The page loads them from this folder via `@font-face` in
`styles.css`.

The design uses three families:

| Family            | Used for                          | Weight needed   |
| ----------------- | --------------------------------- | --------------- |
| Suisse Works      | Headline ("Indifference is…")     | Regular (400)   |
| Suisse Int'l      | Body text in the two columns      | Medium (500)    |
| Suisse Int'l Mono | Labels and the Read more button   | Regular (400)   |

Files in use: `SuisseWorks-Regular.woff2`, `SuisseWorks-Medium.woff2`
(available, not used in the current design), `SuisseIntl-Medium.woff2`,
`SuisseIntlMono-Regular.woff2`. If you add or rename files, update the
`@font-face` rules at the top of `styles.css` to match.

To upload on GitHub: open this folder, click **Add file → Upload files**,
drag the files in, and commit to `main`.

These fonts are licensed, so only upload files your license allows you to
self-host on a website. This repository is public, which means anyone can
download files placed here.
