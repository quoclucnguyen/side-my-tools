# System Patterns

## Architecture Overview

- **Entry**: `src/main.tsx` bootstraps React 19 strict mode, builds a `createBrowserRouter` tree, and renders via `<RouterProvider />` from `react-router/dom`.
- **App Shell**: `src/App.tsx` acts as the persistent layout—derives `activeTitle` from `useLocation`, exposes `<Outlet />` for route children, and renders a sticky header + bottom navigation.
- **Pages**: Route elements live in `src/pages/` as modular functional components. Large page components (like Inventory) are organized in subdirectories with type definitions (`types.ts`), constants (`constants.ts`), utilities (`utils.ts`), and the main component (`Inventory.tsx`). Main export files (e.g., `Inventory.tsx`) serve as entry points that import from the module structure. All components rely on Tailwind tokens for styling (`bg-card`, `border-border`, etc.).
- **Global Styles**: `src/index.css` (Tailwind v4 inline theme) defines design tokens, resets, and ensures `body`/`#root` cover full viewport height.

## UI Patterns

- **Navigation Tabs**: `<NavLink>` with `className={({ isActive }) => ...}` toggles highlight classes; reuse `getNavClasses` helper for consistency.
- **Cards & Badges**: Shared shadcn-style primitives live under `src/components/ui/` (`Card`, `Badge`, `Alert`) and are reused across dashboard and inventory screens.
- **Responsive Layout**: Constraint `max-w-md` container centers experience while keeping `min-h-screen` for full height.

## Data Fetching

- `src/hooks/useInfiniteQuery.ts` implements a reusable Supabase infinite scroll hook backed by `useSyncExternalStore`; call `useInfiniteQuery({ tableName, columns, trailingQuery })` and render `fetchNextPage` controls when `hasMore` is true.
- Inventory integrates the hook with `SupabaseQueryHandler` to keep results ordered by `expiration_date`, falling back to sample data when Supabase is empty.

## Routing Conventions

- Root path `/` maps to `HomePage`; additional routes nested under root to share the shell.
- Use `end` prop on `NavLink` for exact matching of the home route.
- Additional pages should follow same pattern: add TSX file in `src/pages`, update router array, mirror `navItems` entry.

## Documentation Pattern

- Memory Bank lives at repo root under `memory-bank/`.
- Update `activeContext.md` after notable tasks; use `progress.md` to track milestones.
- Reflect architecture shifts in this file to keep future sessions grounded.
