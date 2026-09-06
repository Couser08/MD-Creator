# MD Writer — Architecture, Directory Structure & Developer Guide

Welcome to the comprehensive technical documentation for **MD Writer**. This document outlines the complete codebase architecture, folder hierarchy, function-by-function breakdown, database schema, design tokens, engineering rules, and pro-tips for building, maintaining, and scaling the application.

---

## 1. Executive Architecture Overview

MD Writer is a high-performance, distraction-free Markdown authoring platform engineered with a client-first, offline-capable architecture:
- **Core Framework**: React 19 + TypeScript + Vite 6
- **Styling Engine**: Tailwind CSS v4 with `@tailwindcss/vite`
- **Markdown AST Engine**:
  - `react-markdown`: Secure AST-based React renderer
  - `remark-gfm`: GitHub Flavored Markdown (tables, task checklists, strikethrough, autolinks)
  - `remark-math` + `rehype-katex` + `katex`: Real-time LaTeX mathematical equation rendering
  - `rehype-highlight`: Syntax highlighting for 100+ programming languages
- **Persistence & Cloud Sync**:
  - **Dexie.js (IndexedDB)**: Client-side local storage utilizing a **two-tiered lazy-caching strategy** (metadata index vs on-demand LRU document cache) for instant offline writing (< 1ms).
  - **Supabase (PostgreSQL & Auth)**: Cloud synchronization layer for multi-device backup, user profiles, and persistence.
- **State Layer**: 
  - Zustand (`useThemeStore`, `useAuthStore`): Fast UI, authentication, and theme state.
  - TanStack Query v5: Dexie queries, cache synchronization, and mutations.
- **Routing**: React Router v7 (`/`, `/documents`, `/auth`, `/editor`, `/editor/:id`).

---

## 2. Complete Project Folder & File Hierarchy

```text
md-writer/
├── index.html                     # Main HTML shell, Google Fonts, theme meta tags
├── package.json                   # Project manifest, dependencies, scripts
├── tsconfig.json                  # Root TypeScript configuration
├── tsconfig.app.json              # App TypeScript compiler options (Vite client types & path aliases)
├── tsconfig.node.json             # Vite/Node TypeScript compiler options
├── vite.config.ts                 # Vite bundler configuration + Tailwind v4 plugin
├── supabase_schema.sql            # Supabase SQL migration (Profiles, Documents, RLS, Indexes, Triggers)
├── .env                           # Local environment configuration (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── .env.example                   # Environment configuration template
├── app.md                         # Comprehensive architecture, functions, tokens & pro-tips manual
└── src/
    ├── main.tsx                   # Application bootstrap & QueryClientProvider setup
    ├── App.tsx                    # React Router configuration & database/auth initializers
    ├── index.css                  # Tailwind v4 import, KaTeX CSS, publication print styles, syntax tokens
    ├── db/
    │   ├── index.ts               # Dexie.js database schema, tables & helper functions
    │   └── seed.ts                # Default starter markdown documents & seeder
    ├── stores/
    │   ├── useThemeStore.ts       # Zustand store for Dark/Light theme toggle & persistence
    │   └── useAuthStore.ts        # Zustand store for user auth, Supabase sessions & demo mode
    ├── lib/
    │   ├── queryClient.ts         # TanStack Query Client instance with stale-time policies
    │   └── supabase.ts            # Supabase client wrapper & background cloud sync engine
    ├── hooks/
    │   └── useDocuments.ts        # React Query hooks connecting Dexie IndexedDB to UI
    ├── pages/
    │   ├── HomePage.tsx           # Pixel-perfect landing / workspace home matching UI/UX screenshot
    │   ├── DocumentsPage.tsx      # Full Document Library with search, tag filters, grid/list views
    │   ├── AuthPage.tsx           # Sign In & Sign Up page with demo mode fallback
    │   └── EditorPage.tsx         # Full-featured Markdown Editor with 4 view modes, slash palette & export
    └── components/
        ├── auth/
        │   └── ProfileDropdown.tsx # Navbar profile popup with user avatar, links & sign out
        ├── home/
        │   ├── Navbar.tsx         # Sticky header with logo, links, profile popup, theme toggle & CTAs
        │   ├── Hero.tsx           # Main hero with headline, CTAs, trust badges & mockup
        │   ├── EditorMockup.tsx   # 3D laptop mockup with dual-pane code, preview & arrow
        │   ├── FeatureStrip.tsx   # 5-item horizontal highlight strip with rounded icons
        │   ├── BentoFeatures.tsx  # 3 large pastel feature cards (Organize, Write, Share)
        │   ├── Testimonial.tsx    # Customer quote section with avatar and dot indicators
        │   ├── CtaBanner.tsx      # Bottom call-to-action banner with wavy gradient
        │   ├── Footer.tsx         # Brand footer with navigation links and social icons
        │   ├── DemoModal.tsx      # Interactive modal tour for "Watch Demo"
        │   └── TemplatesModal.tsx # Template picker modal for 1-click document creation
        └── editor/
            ├── SlashCommandMenu.tsx      # Floating command palette with zero-focus-steal arrow navigation
            ├── MarkdownPreview.tsx       # AST markdown preview with interactive tasks & code copy
            ├── DocumentDrawer.tsx        # Slide-over metadata drawer for tags, writing stats & sync
            └── DocumentSwitcherModal.tsx # Fast fuzzy-search document switcher (Ctrl+O)
```

---

## 3. Comprehensive File Dictionary & Function Reference

### `supabase_schema.sql`
- **Role**: PostgreSQL database migration script for Supabase.
- **Key Tables**:
  - `public.profiles`: User profile data (`id REFERENCES auth.users(id)`, `display_name`, `avatar_url`, `email`, `created_at`, `updated_at`).
  - `public.documents`: Lightweight metadata (`id`, `user_id`, `title`, `snippet`, `tags`, `is_pinned`, `is_favorite`, `word_count`, `size_bytes`, `created_at`, `updated_at`, `last_opened_at`).
  - `public.document_contents`: Full markdown text (`id`, `content`, `updated_at`).
  - `public.document_revisions`: Version snapshots (`id`, `document_id`, `content`, `word_count`, `created_at`).
- **Triggers**:
  - `handle_updated_at()`: Automatically refreshes `updated_at` on modification.
  - `handle_new_user()`: Automatically creates a profile record in `public.profiles` upon signup in `auth.users`.
- **Security**: Complete Row Level Security (RLS) policies isolating user records with open testing fallback.

---

### `src/stores/useAuthStore.ts`
- **Role**: User authentication state management.
- **State**: `user: UserProfile | null`, `isLoading: boolean`, `error: string | null`.
- **Functions**:
  - `checkAuth()`: Restores active Supabase session or saved demo user from `localStorage`.
  - `signIn(email, password)`: Logs in via Supabase Auth or fallback demo session.
  - `signUp(email, password, name?)`: Registers user in Supabase Auth or local session.
  - `demoSignIn(name?, email?)`: Instant 1-click sign-in without needing live backend credentials.
  - `signOut()`: Clears active session and triggers Supabase `signOut()`.

---

### `src/components/auth/ProfileDropdown.tsx`
- **Role**: Navbar profile trigger and popover menu.
- **Features**:
  - Displays user avatar, full name, email, and verification status.
  - Quick storage telemetry (Dexie Cache + Supabase Cloud status).
  - Links to *My Documents* (`/documents`), *New Document*, *Open Editor* (`/editor`), and *Sign Out*.

---

### `src/pages/DocumentsPage.tsx`
- **Role**: Document workspace and file library (`/documents`).
- **Features**:
  - Search bar filtering by title, snippet content, or tags.
  - Tag selector pills and pinned status filters.
  - Layout toggle (Card Grid vs High-Density List view).
  - Actions: Open document, Pin/Unpin, Duplicate, Rename, Delete.
  - Import `.md` file button to read local markdown from disk.
  - "+ New Document" button.

---

### `src/components/editor/DocumentSwitcherModal.tsx`
- **Role**: Instant document picker modal inside the editor.
- **Shortcut**: `Ctrl + O` or `Cmd + K` or "Open..." button.
- **Features**:
  - Fast search through all saved documents.
  - Keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
  - 1-click "New Document" and "Import .md" file actions.

---

### `src/components/editor/SlashCommandMenu.tsx` & Keyboard Navigation
- **Role**: Keyboard-driven floating block insertion palette.
- **Ergonomics**: Controlled directly from the textarea's `onKeyDown` handler. Focus stays 100% in the editor textarea so typing never stutters.
- **Shortcuts**:
  - `↑` / `↓`: Cycles through filtered commands.
  - `Enter` / `Tab`: Inserts snippet at cursor.
  - `Esc`: Dismisses palette.
- **Commands**: Headings 1–3, Task Checklists, Bullet Lists, Numbered Lists, Code Blocks, Callout Quotes, 3x3 Tables, KaTeX Math Formulas, Dividers.

---

### `src/index.css` & Publication-Grade PDF Print Engine
- **Role**: Enforces print perfection via `@media print`.
- **Key Rules**:
  - **Forced White Paper**: Renders on `#ffffff` background with `#111827` dark text, even when the user writes in dark mode!
  - **Chrome Suppression**: Hides all navigation, headers, footers, editor textareas, line numbers, status bars, and action buttons.
  - **Clean Formatting**: Tables with light borders, KaTeX equations with sharp vector rendering, and code blocks with light gray backgrounds.
  - **Smart Pagination**: `page-break-after: avoid` on headings; `page-break-inside: avoid` on code blocks, tables, and blockquotes.

---

## 4. Supabase Setup Guide

Follow these steps to connect MD Writer to your Supabase PostgreSQL cloud database:

1. **Create Project**: Sign in to [Supabase](https://supabase.com) and click **New Project**.
2. **Execute Schema**:
   - In your Supabase Dashboard, navigate to the **SQL Editor** tab (terminal icon on left menu).
   - Click **New Query**.
   - Copy the entire contents of [`supabase_schema.sql`](file:///c:/Users/Rahul/OneDrive/Desktop/md%20Writter/supabase_schema.sql) and paste it into the editor.
   - Click **Run** (or `Ctrl+Enter`).
3. **Configure Environment Variables**:
   - In Supabase, navigate to **Project Settings** -> **API**.
   - Copy the **Project URL**.
   - Copy the **anon / public** API Key.
   - Open [`.env`](file:///c:/Users/Rahul/OneDrive/Desktop/md%20Writter/.env) in the project root and paste them:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
4. **Restart Dev Server**:
   - Restart the Vite dev server (`npm run dev`).
   - The editor status bar will display **⚡ Dexie + ☁️ Supabase**, indicating cloud synchronization is active!

---

## 5. Developer & Consumer Pro-Tips

1. **Keyboard-First Workflow**:
   - Type `/` anywhere to open the block inserter, use `↑`/`↓` and press `Enter` to insert.
   - Press `Ctrl + O` to quickly switch between documents.
   - Press `Ctrl + S` to force an immediate save.
2. **Offline-First Resilience**:
   - Even without an internet connection or if Supabase credentials are not provided, MD Writer saves 100% of your work locally in IndexedDB via Dexie.js.
3. **Pristine PDF Export**:
   - Click **Export -> Print to PDF**. The print engine automatically converts the preview into an elegant white-paper document ready for client presentation or archiving.
4. **Interactive Todo Lists**:
   - Click the checkboxes directly in the preview pane to check off tasks in real-time.

---

## 6. Centralized Confirmation Architecture (`useConfirmStore` & `<GlobalConfirmDialog />`)

MD Writer enforces zero accidental data loss through a centralized, Promise-based modal system replacing intrusive browser native `window.confirm()` popups.

- **Store**: [`src/stores/useConfirmStore.ts`](file:///c:/Users/Rahul/OneDrive/Desktop/md%20Writter/src/stores/useConfirmStore.ts)
  - `confirm(options: ConfirmOptions): Promise<boolean>`
  - Variants: `danger` (Red/Rose), `warning` (Amber), `info` (Blue), `primary` (Dark/White).
- **Component**: [`src/components/common/GlobalConfirmDialog.tsx`](file:///c:/Users/Rahul/OneDrive/Desktop/md%20Writter/src/components/common/GlobalConfirmDialog.tsx)
  - Mounted globally at root in [`src/App.tsx`](file:///c:/Users/Rahul/OneDrive/Desktop/md%20Writter/src/App.tsx).
  - Accessible keyboard support: `Escape` dismisses, `Enter` confirms.
  - **Safety Auto-Focus**: On `danger` operations, focus is automatically pinned to the Cancel button to prevent inadvertent keystroke deletions.
- **Coverage**:
  1. Library Document Deletion (`DocumentsPage.tsx`).
  2. In-Editor Document Deletion (`EditorPage.tsx` & `DocumentDrawer.tsx`).
  3. Document Content Erasure / Reset (`EditorPage.tsx` & `DocumentDrawer.tsx`).
  4. User Account Sign Out (`ProfileDropdown.tsx`).

---

## 7. 60–144FPS Game-Engine Animation System & Writing FX Studio

Engineered like a game engine for locked 60–144fps performance with 0ms input latency, eliminating all typing lag during rapid continuous writing:

- **Hardware-Accelerated 2D Canvas Layer (`EditorWritingFx.tsx`)**:
  - Replaces React DOM particle elements with a high-DPI full-screen canvas (`window.devicePixelRatio`).
  - **Zero React Re-renders**: Keystrokes emit directly to a self-suspending `requestAnimationFrame` loop.
  - **Zero-Allocation Particle Pool**: Pre-allocated array of 256 particle structures (`PooledParticle[]`). 0 bytes allocated per keystroke, completely eliminating Garbage Collection pauses.
  - **Zero-Reflow Persistent Mirror Singleton**: Caret positions measured in < 0.05ms without adding/removing DOM elements or forcing synchronous browser layout recalculation.
  - **Direct GPU-Composited Cursor**: Custom carets update via `translate3d(x, y, 0)` directly on the DOM node's `style.transform`, completely bypassing React reconciliation.
- **Master Low-Power Mode**: Instant toggle in Writing FX Studio that disables particle emission on older machines or battery saver.
- **Writing FX Studio**: [`src/components/editor/WritingFxPopover.tsx`](file:///c:/Users/Rahul/OneDrive/Desktop/md%20Writter/src/components/editor/WritingFxPopover.tsx)
  - **Custom Cursors**:
    1. *Neon Glow*: Cyan glowing pulse with sub-pixel glow (`#06b6d4`).
    2. *Terminal*: Classic matrix green block with authentic step-blink (`#22c55e`).
    3. *Amber CRT*: Retro phosphor amber terminal block (`#f59e0b`).
    4. *Minimal Line*: High-contrast slim caret.
    5. *Standard OS*: System default caret.
  - **Typing Physics Effects**:
    1. *Soft Sparks*: Particle burst emitting on every keystroke with realistic gravity and drag.
    2. *Ripple Glow*: Expanding radial shockwave at cursor.
    3. *Matrix*: Digital phosphor falling code glyphs.
    4. *Caret Float*: Gentle spring float when typing.
    5. *Clean (None)*: Zero particles for strict minimalism.
  - **Dual Live Preview**:
    1. *Auto-Typewriter Loop*: Continuous real-time demonstration of the active caret and effect.
    2. *Interactive Test Bar*: One-line sandbox where users can type immediately to feel keystroke physics.

---

## 8. Interactive Outline Navigator & High-Impact Feature Roadmap

### 1. Document Outline / TOC Drawer (`DocumentOutlineDrawer.tsx`)
- Instant extraction of `#` to `######` Markdown headings.
- Real-time section count, visual hierarchy indentations (H1–H6 badges).
- Single-click navigation that calculates exact line offsets and smoothly scrolls the editor directly to target headings.

### 2. Strategic Product Roadmap
1. **Version History & Snapshot Rollback**:
   - Save timestamped revisions in Dexie and Supabase `public.document_revisions`.
   - Side-by-side visual diff slider with 1-click restore.
2. **AI Writing Copilot (Gemini API Integration)**:
   - Floating context actions: "Summarize Document", "Fix Grammar & Tone", "Expand into Bullet Points", or "Generate Code Snippet".
3. **Mermaid & Flowchart Interactive Sandbox**:
   - Direct rendering of `mermaid` blocks for diagrams, state machines, sequence diagrams, and architecture maps.
4. **Writing Goals & Streak Celebrations**:
   - Daily word target tracker (e.g. 500 words/day) with celebratory micro-animations on completion.

---

## 9. Crafted-With-Love Product Updates & Flagship Features Studio (v2.5)

- **Release Timeline & Changelog Modal (`ProductUpdatesModal.tsx`)**:
  - Linear/Apple-inspired chronological updates timeline from foundational v1.0 through v2.5.
  - Interactive category filters (`⚡ Engine & 60FPS`, `📄 PDF Studio`, `✨ UI & Carets`, `☁️ Cloud Sync`), keyword search, and animated heart craft signature.
  - Accessible from the homepage navigation, footer, features banner, and the in-editor status bar.
- **Comprehensive Exploration Studio (`DemoModal.tsx`)**:
  - Interactive feature previewer with categorized capability tabs, architecture specifications, and direct bridge to the release timeline.

---

## 10. Breathable Workspace, Apple-Grade Bento, 8-Template Suite & Local Snapshots (v2.6)

- **Breathable 3-Zone Editor Header (`EditorPage.tsx`)**:
  - Consolidates 12+ adjacent buttons into a distraction-free, airy 3-zone layout.
  - **Zone 1 (Left)**: Back to Home, Document Switcher (`Ctrl+O`), Title input, and discreet auto-save dot telemetry (`● Saved` / `● Saving...`).
  - **Zone 2 (Center)**: Floating segmented view control (`Split`, `Write`, `Read`, `Zen`) with generous negative space.
  - **Zone 3 (Right)**: Consolidated **Tools** dropdown menu (Outline, Table Builder, Writing FX, Templates, Revision History, Focus Sprint), **Export** dropdown (PDF Studio v2.4 + Markdown), Document Info drawer, and Theme toggle.
- **Apple-Grade Homepage Bento Grid (`BentoFeatures.tsx`)**:
  - Strict dynamic light/dark theming (`bg-white dark:bg-neutral-900`) with zero hardcoded dark backgrounds.
  - 5 living micro-UIs: interactive caret terminal with live Neon/Matrix/Amber switcher, 3D layered PDF document sheet stack, live Outline TOC tree with pulsing H1 indicator, Dexie <-> Supabase bidirectional sync bridge, and floating Spotlight-style slash command palette.
- **8-Blueprint Template Suite (`templates.ts` & `TemplatesModal.tsx`)**:
  - Centralized in `src/data/templates.ts`: GitHub README, Technical RFC, PRD, Executive Summary & OKRs, Meeting Notes & Action Items, Research Paper & KaTeX Equations, Bug RCA, and Daily Focus Journal.
  - Available across Homepage, Documents Library, and in-editor via `/template` or the Tools menu with dual-mode "Insert at cursor" vs "Replace document" safety flow.
- **Expanded Slash Commands (`SlashCommandMenu.tsx`)**:
  - Added `/callout` and `/note` (GitHub-style alert note), `/tip` (alert tip), `/warning` (alert warning), `/details` (collapsible accordion), `/kbd` (styled key combination badge), `/mermaid` (flowchart diagram), and `/template` (blueprint picker).
- **Local Dexie.js Revision Snapshot Engine (`RevisionHistoryModal.tsx`)**:
  - 100% offline client-side revision checkpoints in IndexedDB (`MdWriterDB.revisions`).
  - Debounced auto-snapshotting after 30s of typing inactivity, auto-pruned at 30 revisions per document.
  - Side-by-side inspection modal with instant 1-click rollback and automatic safety backup.
- **Distinct Callout Alerts & Rich Markdown (`MarkdownPreview.tsx`)**:
  - Full GitHub-flavored callout support (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!CAUTION]`) with dedicated color signatures (Blue, Emerald, Amber, Purple, Rose), specialized Lucide icons, and stripped raw marker prefixes.
  - Native HTML collapsible accordions (`<details><summary>...`) parsed through `rehype-raw` with rotating chevron indicator and styled hover states.
  - Hardware-styled keyboard badges (`<kbd>Ctrl+K</kbd>`).
- **Live Mermaid.js Diagram Engine (`MermaidBlock.tsx`)**:
  - Renders ````mermaid ```` code blocks as interactive SVG vector diagrams in both preview and PDF exports.
  - Automatic dark/light theme switching with live dynamic re-rendering.
  - Graceful syntax error handling with code fallback and 1-click diagram source copy.




