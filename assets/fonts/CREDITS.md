# Fonts (bundled, offline)

- **Nunito** (`nunito-*.woff2`) — used for Latin text and digits. By Vernon Adams,
  Cyreal, Jacques Le Bailly. **SIL Open Font License 1.1.** Latin subset.
- **Noto Sans Georgian** (`notogeo-*.woff2`) — used for Georgian text. By the Noto
  Project (Google). **SIL Open Font License 1.1.** Georgian subset.

Both are OFL — free to bundle and redistribute. Fetched once at build time from
the fontsource CDN and saved here; the app loads them locally via `@font-face`
in `styles.css` and never fetches fonts at runtime.
