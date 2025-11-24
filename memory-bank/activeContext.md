# Active Context

_Last updated: 2025-10-13 by Codex (GPT-5)._

## Current Focus

- Maintain the mobile app shell (`src/App.tsx`) with sticky header + bottom nav using React Router v7 (`react-router` + `react-router/dom`).
- Ensure routes (`Dashboard`, `Inventory`, `Settings`) render through `<Outlet />` with page components under `src/pages/`.
- Manage Supabase client configuration through `src/lib/supabaseClient.ts` and surface connection issues gracefully in the UI.
- Build shared UI primitives under `src/components/ui/` using shadcn patterns (Card, Badge, Alert) and reuse them across screens.
- Adopt the Cline Memory Bank workflow to persist project knowledge inside `memory-bank/`.

## Recent Changes

- **Inventory Creation Flow**: Added `CreateFoodDrawer` using shadcn `Drawer` + `react-hook-form`/Zod to create food items manually (non-AI) and wired it to Supabase inserts with auth user context.
- Enhanced `useInfiniteQuery` with a `refetch` method (re-initializes store state) so newly created food items appear immediately after submission.
- Extended the creation drawer with optional image upload: resize via `pica` (max 800px, JPEG) before uploading to the Supabase storage bucket defined by `VITE_SUPABASE_FOOD_BUCKET`, storing the resulting public URL on new records.
- Added AI-powered image analysis in `CreateFoodDrawer`, invoking Gemini to extract name/quantity/unit/expiration/category from the preview and auto-fill the form when the user’s API key is configured.

- **Inventory Module Structure**: Refactored the `Inventory.tsx` file (~200 lines) into a modular structure under `src/pages/Inventory/`. Split into separate files: `types.ts` (type definitions), `constants.ts` (fallback data), `utils.ts` (utility functions), and `Inventory.tsx` (main component). The original `src/pages/Inventory.tsx` now serves as an entry point that re-exports the main component.
- Introduced shadcn-style Card, Badge, and Alert components for the dashboard and inventory flows, reducing bespoke Tailwind markup.
- Aligned the inventory data model with the `public.food_items` schema (expiration_date/category/image_url) and surfaced category + imagery in the UI.
- Integrated Supabase by adding `@supabase/supabase-js`, introducing `getSupabaseClient`, and wiring the inventory page to load from the `food_items` table with graceful fallbacks.
- Renamed navigation to `Tổng quan` / `Kho thực phẩm` / `Cài đặt`, added lucide icons, and refreshed the dashboard/ inventory page copy to match the new flows.
- Replaced `react-router-dom` with the consolidated `react-router` package following v7 guidance.
- Added initial page stubs (`DashboardPage`, `InventoryPage`, `SettingsPage`) using Tailwind utilities and copy in Vietnamese.
- Updated global styles (`src/index.css`) to remove centered body flex layout and support full-height mobile rendering.
- Documented project goals, product context, and progress via new memory-bank markdown files.
- Simplified the Docusaurus docs package to a single `home` page and removed the starter blog/sidebar content so the docs folder is a clean mockup.
- Extended SRS REQ-005 to capture the AI-assisted "Tạo thực phẩm mới" flow and associated validation rules.
- Fixed CSS import order in `src/index.css` to resolve PostCSS error.
- Conducted full project review and updated Memory Bank to reflect `createMemoryRouter` usage and TMA integration details.

## Next Steps

1. Populate Supabase with production-ready data and extend dashboard metrics with live aggregates.
2. Introduce shadcn component registry as needed (`npx shadcn@latest add ...`) while keeping tokens aligned.
3. Capture emerging patterns (e.g., layout wrappers, typographic scales) in `systemPatterns.md`.
4. Review Memory Bank before each task (“follow your custom instructions”) and update after notable changes.

## Risks & Considerations

- Tailwind v4 (JIT) requires class usage in source—avoid dynamic string concatenation without safelisting.
- Keep translations consistent; mixing Vietnamese/English may confuse users.
- Ensure additional dependencies are justified; maintain minimal bundle for mobile performance.
