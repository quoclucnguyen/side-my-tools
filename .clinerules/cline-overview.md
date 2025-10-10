# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all TypeScript sources. `main.tsx` bootstraps the React app, `App.tsx` hosts the primary UI, and global styles live in `index.css`.
- Use `src/lib/` for shared utilities (e.g., `utils.ts`) and `src/assets/` for in-bundle media. Public assets that should bypass bundling belong in `public/`.
- Aliases are configured so `@/` maps to `src/`; keep cross-module imports aligned with this pattern.
- Tailwind theming and shadcn registry defaults are defined in `components.json`; update this file when introducing new UI primitives.

## Build, Test, and Development Commands
- Install dependencies with `npm install` (Node 18+ recommended for Vite 7).
- `npm run dev` launches the Vite dev server with React Fast Refresh.
- `npm run build` performs a strict TypeScript project build (`tsc -b`) and outputs a production bundle.
- `npm run preview` serves the production build locally for smoke testing.
- `npm run lint` runs ESLint across the repo; fix issues before opening a PR.

## Coding Style & Naming Conventions
- Follow the ESLint rules bundled via `@eslint/js`, `typescript-eslint`, and React hooks/refresh plugins. Keep builds lint-clean.
- TypeScript is in strict mode; resolve all type errors rather than suppressing them.
- Use 2-space indentation, single quotes for strings, PascalCase for React components, and camelCase for helpers.
- Keep Tailwind classes readable: group layout → color → state, and prefer `@/lib/utils` helpers for composing class names.

## Testing Guidelines
- No automated test runner is configured yet. Before adding Vitest or similar, align with maintainers on scope and tooling.
- Write UI changes to be testable (pure components, minimal side-effects) so we can backfill tests when the harness lands.
- Perform manual verification in `npm run preview` for user-facing features and provide reproduction steps in PRs.

## Code Quality & Static Analysis
- After editing TypeScript/JavaScript files, run `npx sonarjs@latest analyze <file-path>` to verify code quality metrics.
- Pay special attention to cognitive complexity warnings (threshold: 15). Refactor complex functions by extracting logic into smaller, focused components or utility functions.
- Ensure all SonarJS warnings are addressed before opening a PR.
- Always run `npm run build` after editing component files to verify TypeScript compilation and catch any potential issues early.

## Commit & Pull Request Guidelines
- Git metadata is not embedded in this workspace; default to imperative, Conventional Commit-style messages (e.g., `feat: add sidebar toggles`).
- Keep commits focused and self-contained; include screenshots or recordings when altering UI flows.
- Pull requests should summarize intent, link to any tracking issue, list manual test notes, and call out follow-up work or risks.

## AI Workflow & Memory Bank Expectations
- Always load the Cline Memory Bank before acting: review `memory-bank/projectbrief.md`, `productContext.md`, `activeContext.md`, `systemPatterns.md`, `techContext.md`, and `progress.md` at the start of every task.
- Operate in Plan ➜ Act loops. Begin in Plan mode to confirm context, propose strategy, and request clarifications; only then switch to Act mode for implementation.
- Log meaningful changes: update `memory-bank/activeContext.md` after notable edits and append milestones to `memory-bank/progress.md`.
- When project knowledge evolves (new patterns, tech decisions, constraints), reflect it in the appropriate memory-bank file so future sessions stay aligned.
- Whenever database table definitions or schema updates are provided, capture them in the Memory Bank (e.g., update `techContext.md` or another relevant file) so future work stays consistent.
- If Memory Bank instructions conflict with ad-hoc requests, pause and surface the conflict rather than ignoring established process.
