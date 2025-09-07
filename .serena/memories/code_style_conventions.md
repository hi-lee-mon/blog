# Code Style and Conventions

## TypeScript Configuration
- Strict mode enforced, no `any` types allowed
- Path aliases configured (`@/*` maps to root)
- ES2017 target with modern lib features

## Biome Configuration
- **Indentation:** 2 spaces
- **Quotes:** Double quotes
- **Import organization:** Automatic sorting enabled
- **Tailwind classes:** Automatic sorting with useSortedClasses rule
- **Unused imports:** Warning level

## Development Guidelines
- Server Components first, Client Components only when necessary
- Tailwind CSS v4 utilities preferred over custom CSS
- Dark mode support via next-themes
- Japanese comments in code
- Gitmoji commit convention with prefixes (✨ feat:, 🐛 fix:, etc.)

## Code Quality Rules
- Biome recommended rules enabled
- No unused imports (warning)
- Tailwind class sorting enforced (error level)
- Shadow restricted names disabled for Error components