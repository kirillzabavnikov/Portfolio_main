# Publishing this portfolio

The primary source repository is https://github.com/kirillzabavnikov/kirillzabavnikov.github.io.
Its default branch is `main`. Preserve this repository and its existing history.

For authorized future website edits, implement and verify changes, then push the
finished source commit to `origin/main`. `.github/workflows/pages.yml` builds and
publishes GitHub Pages on each push. Check the Actions result before reporting
publication as successful. A successful push alone does not verify deployment.

The production Pages address is https://kirillzabavnikov.github.io/.
The repository is the account's root Pages site. Keep its current name.
The workflow derives the address and empty base path from the repository name.

Use `npm run build`. The root site needs no base path. Its default site URL in
`content/site.json` is the production GitHub Pages address. Prefix raw image URLs
with `assetUrl` from `lib/paths.ts`; Next.js Link handles any configured base path
itself. Do not add `/Portfolio_main` to links, Markdown, or asset metadata.

The existing Sites deployment and `.openai/hosting.json` remain a separate
working deployment. Do not delete or recreate it, change its audience, or claim
it mirrors GitHub automatically. Publishing the same update there requires the
Sites workflow and its current access policy.

Never commit credentials, build output, or node_modules. Keep original case
materials intact. All Notion case links must open in a new tab.
