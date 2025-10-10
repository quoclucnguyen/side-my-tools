# Product Context

## Problem & Opportunity

Developers need a compact toolkit that opens quickly on mobile, surfaces common workflows (home dashboard, work queue, settings), and can grow with additional utilities. The current repo is an early prototype that must establish a reliable UX foundation before adding real data.

## Target Experience

- **App Shell**: Persistent header with product identity (“Side My Tools”) and contextual title, backed by a bottom nav that feels native.
- **Pages**:
  - `Home`: landing surface for quick stats or widgets.
  - `Tasks`: list-style presentation for work items.
  - `Settings`: copy-heavy page for preferences.
- **Navigation**: Tab-like buttons with clear active state, accessible focus handling, and text labels (icons optional later).

## UX Principles

- Mobile-first breakpoints; should read well on 360–420px widths.
- Content blocks use shadcn “card” look—rounded corners, border, subtle elevation.
- Tone: friendly but professional; Vietnamese copy currently used (“Trang chủ”, etc.).
- Provide breadcrumbs/context via the sticky header title that mirrors the active route.

## Differentiators

- Shadcn styling + Tailwind tokens allow quick theming.
- Memory Bank ensures project knowledge persists between coding sessions, preventing context loss.
- Router-driven shell means new sections can be added with minimal layout duplication.
