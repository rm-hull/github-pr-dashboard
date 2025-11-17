
# TODO

This file contains a list of actionable improvements for the GitHub PR Dashboard application.

### Performance

*   **Code-splitting:** The application is a single-page application, but it doesn't seem to be using code-splitting. By code-splitting at the route level, the initial bundle size can be reduced, leading to faster load times.
*   **Memoization:** In `PullRequestsList.tsx`, the `pullsBySelector` is memoized using `useMemo`, but the `isSelected` function is not. This could lead to unnecessary re-renders.

### Readability

*   **Type-safety:** The `selector` object in `PullRequestsList.tsx` has a type of `Record<ListViewBy, (pull: PullRequest) => string | null>`, but the values are not type-safe.
*   **CSS-in-JS:** The project uses Chakra UI, which is a CSS-in-JS library. However, there is a separate CSS file for the `InfoPopover` component. This could be moved into the component itself.

### Functional

*   **Error handling:** The `useOpenPullRequests` hook does not have any error handling. If the GitHub API returns an error, the application will crash.
*   **Loading states:** The `PullRequestsList` component has a loading state, but it only returns `null`. A loading skeleton would provide a better user experience.

### New Features

*   **Metrics Dashboard:** A dedicated route (`/metrics`) that displays various metrics and charts, such as:
    *   **Pull Request Velocity:** A chart showing the number of PRs opened, merged, and closed over time.
    *   **Time to Merge:** A chart showing the average time it takes to merge a PR.
    *   **Review Distribution:** A chart showing the distribution of reviews among team members.
*   **Recently Closed PRs:** A new route (`/closed`) that lists recently closed and merged pull requests, with the ability to filter by date and user.
*   **Repository Build Status:** A new route (`/repos`) that lists all of the user's repositories, showing the current build status of the main branch for each repository.
*   ~~**Draft PR Support:** The ability to view and manage draft pull requests.~~
*   **PR Templates:** The ability to create and use pull request templates to pre-fill the PR description with a predefined template.
*   **Customizable Dashboards:** The ability to create custom dashboards with a variety of widgets, such as charts, lists of PRs, and build statuses.
*   **Notifications:** The ability to receive notifications for events such as new PRs, comments, and build failures.
