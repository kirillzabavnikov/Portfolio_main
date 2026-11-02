# Publishing this portfolio

The primary source repository is https://github.com/kirillzabavnikov/Portfolio_main.
Its default branch is `main`. Preserve this repository and its existing history.

For authorized future website edits, implement and verify changes, then push the
finished source commit to `origin/main`. `.github/workflows/pages.yml` builds and
publishes GitHub Pages on each push. Check the Actions result before reporting
publication as successful. A successful push alone does not verify deployment.

The expected project Pages address is
https://kirillzabavnikov.github.io/Portfolio_main/.
The workflow derives the address and base path from the repository name, so it
also supports a future rename to `kirillzabavnikov.github.io` without a subpath.

Use `npm run build`. To verify the project Pages variant locally, set
`NEXT_PUBLIC_BASE_PATH=/Portfolio_main` and
`NEXT_PUBLIC_SITE_URL=https://kirillzabavnikov.github.io/Portfolio_main/` for the
build. Prefix raw image URLs with `assetUrl` from `lib/paths.ts`; Next.js Link
handles the configured base path itself. Do not hardcode the GitHub path into
Markdown or asset metadata.

The existing Sites deployment and `.openai/hosting.json` remain a separate
working deployment. Do not delete or recreate it, change its audience, or claim
it mirrors GitHub automatically. Publishing the same update there requires the
Sites workflow and its current access policy.

Never commit credentials, build output, or node_modules. Keep original case
materials intact. All Notion case links must open in a new tab.
