# Progress Log

_Chronological timeline of major milestones. Update after meaningful changes._

## Completed

- **2025-02-15** — Created mobile-first app shell with sticky header, scrollable content, and bottom navigation (shadcn/Tailwind styling).
- **2025-02-16** — Added React Router configuration with separate page modules (`Home`, `Tasks`, `Settings`) and replaced `react-router-dom` with `react-router` v7.
- **2025-02-16** — Introduced Cline Memory Bank folder (`memory-bank/`) and documented project context, architecture, and current focus.
- **2025-02-17** — Renamed navigation to Dashboard/Inventory/Settings, added lucide icons, and integrated Supabase client + inventory sync fallback flow.
- **2025-02-17** — Brought in shadcn/ui primitives (Card, Badge, Alert) and refactored dashboard + inventory screens to use shared components.
- **2025-10-10** — Integrated Zustand store for authentication state management with Supabase auth (signIn/signUp/signOut), added AuthGuard component for route protection, created login/signup page with shadcn UI components, and implemented logout functionality in header dropdown.
- **2025-10-10** — Added Gemini API key configuration to Settings page using TanStack React Query for data management, created user_settings table integration, auto-loading of settings from database, optimistic updates for better UX, and implemented model selection dropdown with preferences stored in settings.gemini json.
- **2025-10-13** — Replaced the Docusaurus starter content with a single Home doc page and removed blog/tutorial scaffolding to provide a clean docs mockup.
- **2025-10-13** — Documented the AI-assisted flow for creating new food items in SRS REQ-005, including validation requirements.
- **2025-10-13** — Shipped manual "Tạo mới thực phẩm" drawer (non-AI) with Zod validation, Supabase insert, and inventory refetch support.
- **2025-10-14** — Added optional image upload to the create-food drawer with client-side resize via pica, Supabase storage integration, and updated SRS documentation.
- **2025-11-24** — Fixed CSS import order in `src/index.css` to resolve PostCSS error.
- **2025-11-24** — Updated Memory Bank files (`systemPatterns.md`, `techContext.md`) to align with actual codebase (TMA auth, MemoryRouter).

## In Flight

- Seed Supabase tables and replace placeholder stats with live data across dashboard + inventory.
- Test login/logout flow with actual Supabase instance.
- Test Gemini API key save/load functionality with real database.
- Expand navigation as new features are defined.
- Keep Memory Bank synchronized after each development session.

## Upcoming Ideas

- Integrate shadcn component registry for standardized UI pieces.
- Add localization strategy if bilingual support is required.
- Consider adding social login options (Google, GitHub) to registration flow.
- Use the newly configured Gemini API for AI-powered features (recipe suggestions, inventory insights).
