# Contributing to YYC³ AI-PAI

Thank you for your interest in contributing to YYC³ AI-PAI! This guide will help you get started.

## Quick Start

```bash
# 1. Fork & clone
git clone https://github.com/YYC3/YYC3-AI-PAI.git
cd YYC3-AI-PAI

# 2. Install dependencies
pnpm install

# 3. Start development
pnpm dev
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:

| Prefix | Purpose |
|--------|---------|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation |
| `refactor/` | Code refactoring |
| `perf/` | Performance improvements |
| `test/` | Test additions/fixes |
| `chore/` | Build/tooling changes |

### 2. Develop

- Follow existing code patterns in the project
- Use TypeScript strict mode
- Use `useThemeStore()` for themed styling
- Use `useI18n()` for all user-facing text
- Write tests for new functionality

### 3. Quality Checks

```bash
# Must pass before committing
pnpm lint              # 0 errors, 0 warnings required
pnpm test              # All tests must pass
pnpm build             # Must succeed
```

### 4. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:

```
feat(editor): add multi-cursor support
fix(preview): resolve iframe sandbox CSP issue
docs(readme): update installation instructions
perf(store): optimize Zustand selector performance
```

### 5. Pull Request

- Fill in the PR template completely
- Link related issues
- Ensure all CI checks pass
- Request review from maintainers

## Code Standards

### TypeScript

- Strict mode enabled (`strict: true`)
- No `any` types without justification
- Proper interface/type definitions for all props
- Use `type` for object shapes, `interface` for extendable types

### React

- Functional components only
- Hooks rules (`react-hooks/exhaustive-deps`)
- `useCallback` / `useMemo` for expensive operations
- Proper cleanup in `useEffect`

### Styling

- Tailwind CSS utility classes
- Theme tokens via `useThemeStore()`
- No inline styles except for dynamic theme values
- Responsive design by default

### State Management

- Zustand stores in `src/app/store/`
- One store per domain concern
- Use `persist` middleware for user preferences
- Use `devtools` middleware for debugging

### Testing

- Unit tests: Vitest (`src/**/*.test.ts`)
- E2E tests: Playwright (`e2e/`)
- Mock browser APIs in `vitest.setup.ts`
- Test files co-located with source

## Project Architecture

```
src/app/
├── components/     # UI components (shadcn/ui pattern)
│   ├── ui/         # Base UI primitives
│   ├── settings/   # Settings panel tabs
│   └── ide/        # IDE-specific components
├── store/          # Zustand state stores
├── hooks/          # Custom React hooks
├── services/       # Business logic services
├── i18n/           # Internationalization
└── types/          # TypeScript type definitions
```

## Component Template

```tsx
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { useThemeStore } from "../store/theme-store"
import { useI18n } from "../i18n/context"

interface MyComponentProps {
  className?: string
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className }, ref) => {
    const { tokens } = useThemeStore()
    const { t } = useI18n()

    return (
      <div ref={ref} className={cn("base-classes", className)}>
        {t("namespace", "key")}
      </div>
    )
  }
)

MyComponent.displayName = "MyComponent"
```

## Getting Help

- **Issues**: <https://github.com/YYC-Cube/YYC3-AI-PAI/issues>
- **Email**: <admin@0379.email>
- **Documentation**: See `docs/` directory

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
