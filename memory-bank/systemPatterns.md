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
- Supabase write operations (create/update/delete) use TanStack Query `useMutation` hooks for consistent error handling, loading states, and optimistic updates. Image upload follows a standard pattern: resize with `pica`, upload to Supabase Storage with unique paths (`${user.id}/${uuid}.jpg`), extract public URL. Coordinate multiple UI states with `form.formState.isSubmitting || mutation.isPending`.

## Routing Conventions

- Root path `/` maps to `HomePage`; additional routes nested under root to share the shell.
- Use `end` prop on `NavLink` for exact matching of the home route.
- Additional pages should follow same pattern: add TSX file in `src/pages`, update router array, mirror `navItems` entry.

## Documentation Pattern

- Memory Bank lives at repo root under `memory-bank/`.
- Update `activeContext.md` after notable tasks; use `progress.md` to track milestones.
- Reflect architecture shifts in this file to keep future sessions grounded.

## Telegram Mini Apps (TMA) Auth Pattern

- Goal: Cho phép TMA nhận diện người dùng Telegram và đăng nhập vào Supabase theo biến thể B1 (bridge session).
- Frontend:
  - Phát hiện `initDataRaw`: ưu tiên `window.Telegram.WebApp.initData`; fallback query `?tgWebAppData`/`?initData`. Helper tại `src/lib/tma.ts` (`getInitDataRaw`, `exchangeTma`).
  - `auth.store.ts`:
    - `checkAuth()` gọi Supabase `getUser()`. Nếu chưa có user và có `initDataRaw` ⇒ gọi `exchangeTma()` để đổi phiên rồi `supabase.auth.setSession(...)`.
    - Thêm action `tmaLogin()` để trigger thủ công khi cần.
- Edge Function: `supabase-functions/tma-exchange/index.ts`
  - Xác thực `initDataRaw` theo Telegram:
    - `data_check_string`: join các cặp key=value (bỏ `hash`), sort theo key, nối bằng `\n`.
    - `secret_key = HMAC_SHA256(key='WebAppData', data=BOT_TOKEN)`.
    - `check_hash = HMAC_SHA256(key=secret_key, data=data_check_string)` (hex) và so với `hash`.
    - TTL: kiểm tra `auth_date` (mặc định ±24h) để chống replay.
  - Upsert Supabase Auth user:
    - Email alias: `tg_<telegram_id>@tma.local` (email_confirm true).
    - Ghi `telegram_id`, `username`, ... vào `app_metadata`/`user_metadata`.
  - Bridge session:
    - Dùng Admin API `generateLink({ type: 'magiclink', email })` lấy `email_otp`.
    - Gọi `${GOTRUE_URL}/verify` với `anon key` để nhận `{ access_token, refresh_token, user }`.
  - Trả JSON cho client: tokens + `telegram_user`.
  - Lưu ý: File dùng Deno; có `// @ts-nocheck` để tránh cảnh báo VSCode khi phát triển local.
- Môi trường/Secrets:
  - `TELEGRAM_BOT_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`, `SUPABASE_ANON_KEY`, tùy chọn `GOTRUE_URL`.
  - Client có thể đặt `VITE_TMA_EXCHANGE_URL` để override URL; mặc định `${VITE_SUPABASE_URL}/functions/v1/tma-exchange`.
- RLS & Scope:
  - RLS hoạt động dựa trên session Supabase đã mint; không cần thay đổi schema.
  - App chạy trên route chính; `AuthGuard` sẽ bootstrap TMA trong `checkAuth`, sau đó vẫn giữ logic redirect `/login` nếu không trong TMA hoặc không có phiên.
- Tài liệu:
  - Hướng dẫn triển khai/triển khai thử tại `supabase-functions/tma-exchange/README.md`.
  - Helpers client: `src/lib/tma.ts`.
  - Tích hợp store: `src/stores/auth.store.ts`.
