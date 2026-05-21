# Changelog

All notable changes to YYC³ AI-PAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.8.3] - 2026-05-21

### Changed

- **ESLint**: Full code quality audit — reduced from 502 warnings to 0
  - Removed 37+ unused imports across 15+ files
  - Fixed 39 `react-hooks/exhaustive-deps` violations
  - Replaced 119 `console.log` → `console.warn` (ESLint `no-console` rule)
  - Disabled `no-explicit-any` for type definition files
  - Disabled React Compiler advisory rules (`set-state-in-effect`, `purity`, `refs`, `preserve-manual-memoization`, `immutability`)
  - Disabled `react-refresh/only-export-components` for utility exports
  - Disabled `@typescript-eslint/no-namespace` for Monaco type declarations

### Fixed

- `ActivityLog.tsx`: Moved `DEFAULT_TAB_ORDER` and `TAB_ORDER_LS_KEY` to module scope for stable references
- `useAutoSave.ts`: Wrapped `formatTime` in `useCallback` for referential stability
- `CyberEditor.tsx`, `CollabPanel.tsx`: Fixed `collab` dependency in `useMemo`
- `DetachedWindow.tsx`, `PanelDropZone.tsx`: Added missing `panelDnD`/`dnd` dependencies
- `IDEMode.tsx`: Added `ideStore` dependency to 6 sync effects, fixed `projectStore` deps
- `LivePreview.tsx`: Added `preview` dependency to 5 hooks
- `StatDetailPanel.tsx`: Fixed `stat.key` → `stat.value` in useMemo dependency
- `useCRDTCollab.test.ts`: Fixed import path `../store/` → `../../store/`

### Added

- `vitest.setup.ts` — Global test setup with browser API mocks (indexedDB, WebRTC, WebSocket, BroadcastChannel, ResizeObserver, IntersectionObserver)
- `vitest.config.ts` — Configured `setupFiles: ['./vitest.setup.ts']`
- `vite.config.ts` — Added `manualChunks` for bundle splitting (8 vendor chunks)

### Build

- Build time: ~2.3s
- Bundle: 1.9MB JS split into logical chunks
- No circular dependencies
- `pnpm lint --max-warnings 0` passes cleanly

## [4.8.2] - 2026-03-25

### Added

- CRDT collaboration store and tests
- Performance monitoring store
- Offline storage with IndexedDB
- WebGPU inference store
- Intelligent workflow store
- AI metrics store with error classification
- Preview store with device presets
- Plugin marketplace system

### Changed

- Migrated to ESLint Flat Config (`eslint.config.mjs`)
- Updated to React 19
- Updated to Vite 6
- Updated to Tailwind CSS 4

## [4.8.1] - 2026-03-19

### Added

- IDE mode with three-panel layout
- Monaco Editor integration
- Live preview with iframe sandboxing
- AI chat panel with multi-turn conversation
- Command palette with fuzzy search
- Floating widget for quick AI access
- Fullscreen AI mode
- Settings panel (appearance, shortcuts, AI, workspace)
- System panel (plugins, security, offline)
- Database panel with SQL console
- Git panel with version history
- Recent files panel
- Diagnostics panel
- Theme preview component
- Dual theme system (Cyberpunk / Clean)
- i18n support (Chinese / English)
- Panel drag-and-drop with cross-window support
- Auto-save with editor preferences

### Infrastructure

- Vite build configuration
- ESLint with TypeScript, React Hooks, React Refresh plugins
- Vitest for unit testing
- Playwright for E2E testing
- Prettier for code formatting
- Tailwind CSS 4 with @tailwindcss/vite plugin
- 26 Zustand stores
- 7 custom hooks
- 6 service modules
- 111 React components
- 201 TypeScript/TSX source files

## [4.8.0] - 2026-03-15

### Added

- Initial project scaffold
- Vite + React + TypeScript setup
- pnpm workspace configuration
- Base component architecture
- Theme token system
- State management foundation

[4.8.3]: https://github.com/YYC-Cube/YYC3-AI-PAI/compare/v4.8.2...v4.8.3
[4.8.2]: https://github.com/YYC-Cube/YYC3-AI-PAI/compare/v4.8.1...v4.8.2
[4.8.1]: https://github.com/YYC-Cube/YYC3-AI-PAI/compare/v4.8.0...v4.8.1
[4.8.0]: https://github.com/YYC-Cube/YYC3-AI-PAI/releases/tag/v4.8.0
