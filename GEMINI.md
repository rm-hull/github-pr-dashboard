# GEMINI.md

## Project Overview

This is a single-page application built with **TypeScript** and **React** that serves as a dashboard for managing GitHub Pull Requests. It allows users to list their open PRs, merge them, and post comments.

The project is scaffolded with **Vite** for a fast development experience and build process.

### Key Technologies:

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **UI Library:** Chakra UI v3
*   **Routing:** TanStack Router
*   **Data Fetching & State:** TanStack Query
*   **GitHub API:** Octokit.js
*   **Package Manager:** Yarn 4

## Building and Running

### Prerequisites

1.  Install dependencies using Yarn:
    ```bash
    yarn install
    ```
2.  Create a `.env` file in the project root. Copy the contents of `.env.example` and add your GitHub OAuth App Client ID:
    ```
    VITE_GITHUB_CLIENT_ID=YOUR_CLIENT_ID
    VITE_REDIRECT_URI=http//localhost:5173/github-pr-dashboard/
    ```

### Key Commands

The following scripts are available in `package.json`:

*   **`yarn dev`**: Starts the Vite development server for local development.
*   **`yarn build`**: Builds the application for production.
*   **`yarn test`**: Runs the test suite using Vitest.
*   **`yarn lint`**: Lints the codebase using ESLint to enforce code quality.
*   **`yarn format`**: Formats the code using Prettier.

## Development Conventions

### Code Style

*   **Formatting:** The project uses **Prettier** for consistent code formatting. Run `yarn format` before committing.
*   **Linting:** A comprehensive **ESLint** setup is in place (`eslint.config.js`) to catch errors and enforce best practices for TypeScript and React. Run `yarn lint` to check your code.
*   **React:** The project uses the new React Compiler (`babel-plugin-react-compiler`), so there is no need for manual `useMemo` or `useCallback` optimizations in most cases.

### Architecture

*   **Component-Based:** The UI is built with React components, located in `src/components`.
*   **Routing:** Client-side routing is handled by **TanStack Router**. Route definitions are co-located with the components they render, starting with `src/routes/__root.tsx`.
*   **API Interaction:** All interactions with the GitHub API are managed through the `useApiClient` hook (`src/hooks/useApiClient.ts`), which provides an authenticated **Octokit** instance.
*   **Data Fetching:** **TanStack Query** is used for fetching, caching, and updating data from the GitHub API. Custom hooks in `src/hooks` (e.g., `useOpenPullRequests`) encapsulate data-fetching logic.
*   **Styling:** The UI is built using the **Chakra UI** component library. Customizations and providers are in `src/components/ui`.

### File Structure

*   `src/components`: Reusable React components.
*   `src/hooks`: Custom React hooks, especially for data fetching and business logic.
*   `src/routes`: Components that represent pages or routes in the application.
*   `src/utils`: Utility functions.
*   `public`: Static assets.
