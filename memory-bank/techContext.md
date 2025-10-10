# Tech Context

## Stack

- **Runtime**: React 19.1 + TypeScript 5.9 (strict), Vite 7 bundler.
- **Routing**: `react-router` v7 (`RouterProvider` from `react-router/dom`).
- **Styling**: Tailwind CSS 4.1 w/ inline theme tokens in `src/index.css`; tw-animate for extra animations; shadcn-style tokens but components not yet imported.
- **Icons**: `lucide-react` available for future use.

## Development

- Install deps: `npm install` (Node 18+ recommended).
- Commands:
  - `npm run dev` — Vite dev server with React Fast Refresh.
  - `npm run build` — TypeScript project references + production bundle.
  - `npm run preview` — Serve build output locally.
  - `npm run lint` — ESLint (react, hooks, refresh, typescript-eslint).

## Project Layout

- `src/main.tsx`: router + render entry.
- `src/App.tsx`: layout/shell with nav items array.
- `src/pages/`: route-level screens (`Home`, `Tasks`, `Settings`).
- `src/lib/`: shared utilities (currently empty, future home for helpers like `cn`).
- `src/assets/`: static assets (includes Vite/React logos).

## Configuration Notes

- Tailwind v4 removes traditional config; keep tokens in `index.css` and rely on `@tailwindcss/vite`.
- ESLint config at `eslint.config.js` uses flat config; follow repo style (2-space indent, single quotes).
- Vite config uses React plugin w/ React compiler—ensure new TSX features remain compatible.

## Database Schema

### `public.food_items`

| Column           | Type         | Constraints / Notes                                      |
| ---------------- | ------------ | -------------------------------------------------------- |
| `id`             | `uuid`       | Primary key, defaults to `gen_random_uuid()`            |
| `user_id`        | `uuid`       | FK → `auth.users(id)`, nullable, cascade delete         |
| `name`           | `text`       | Required                                                 |
| `quantity`       | `numeric`    | Required                                                 |
| `unit`           | `text`       | Required                                                 |
| `expiration_date`| `date`       | Required                                                 |
| `category`       | `text`       | Required                                                 |
| `created_at`     | `timestamptz`| Defaults to `now()`                                      |
| `updated_at`     | `timestamptz`| Defaults to `now()`                                      |
| `image_url`      | `text`       | Optional                                                 |

Indexes:
- `idx_food_items_expiration` on `(expiration_date)`
- `idx_food_items_user_id` on `(user_id)`
