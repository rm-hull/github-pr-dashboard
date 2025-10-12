# GitHub PR Dashboard

This is a minimal **TypeScript React** single-page app scaffolded for:

- Lists your **open PRs** (search API)
- Merge PRs and post comments (e.g. `@dependabot rebase`)
- Uses **@tanstack/react-query** for data fetching and mutations
- Uses **Chakra UI v3** for UI / UX

## Quickstart

1. `git clone` this project (or copy files into a new Vite TS project)
2. `yarn install`
3. Create a `.env` at project root with:

```
VITE_GITHUB_CLIENT_ID=YOUR_CLIENT_ID
VITE_REDIRECT_URI=http//localhost:5173/github-pr-dashboard/
```

4. `yarn dev`
5. In the app: click **Login**, where you will be redirected to login with your GitHub credentials.
