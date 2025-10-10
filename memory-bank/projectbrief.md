# Project Brief

## Mission

Build **Side My Tools** as a mobile-first React application that showcases utility screens behind a lightweight shell. The experience should feel like a native mobile app despite shipping as a Vite web bundle.

## Core Requirements

- Mobile-friendly layout with a sticky header, scrollable content area, and bottom navigation.
- Shadcn UI + Tailwind CSS provide the visual language (tokens already defined in `src/index.css`).
- React Router manages navigation between core screens (`/`, `/tasks`, `/settings`) while keeping the shell persistent.
- Keep TypeScript strict, adhere to the repo style rules (2-space indent, single quotes, `@/` alias).

## Constraints & Guardrails

- Use React 19 + Vite 7; avoid class components.
- Keep dependency surface minimal—prefer shadcn primitives or utilities in `@/lib`.
- Tailwind v4 w/ inline config in `index.css`; avoid reintroducing legacy config files.
- Respect project instructions on linting (`npm run lint`) and build (`npm run build`) before shipping.

## Success Criteria

- App boots without warnings via `npm run dev` on Node 18+.  
- Navigation is instant and preserves the shell across route changes.  
- Pages render responsively on narrow viewports without horizontal scroll.  
- Design tokens remain centralized in `index.css`; new UI components reuse shadcn patterns.  
- Documentation (Memory Bank + repo README) stays aligned with actual code paths.
