# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Conversation rule
Always respond in 日本語

## Development Commands

**Development Server:**
```bash
npm run dev        # Start development server with Turbopack
```

**Code Quality:**
```bash
npm run lint       # Lint with Biome
npm run lint:fix   # Auto-fix lint issues
npm run format     # Format code with Biome
npm run format:fix # Auto-format code
npm run check      # Check format + lint
npm run check:fix  # Auto-fix format + lint
```

**Build & Testing:**
```bash
npm run build      # Build for production
npm run start      # Start production server
npm run storybook  # Start Storybook dev server
npm run build-storybook # Build Storybook
```

**Database (Prisma):**
```bash
npm run p:gen      # Generate Prisma client
npm run p:mig      # Run database migrations
npm run p:studio   # Open Prisma Studio
npm run p:seed     # Seed database
```

## Architecture Overview

**Next.js 15 App Router Blog Application**
- **Framework:** Next.js 15 with App Router, TypeScript strict mode, React 19 beta
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI components
- **Code Quality:** Biome for formatting/linting
- **Testing:** Vitest, Storybook with addon-vitest
- **State Management:** XState for complex state logic

**Key Directory Structure:**
```
app/
├── (public)/           # Public pages group
│   ├── layout.tsx     # Public layout
│   ├── page.tsx       # Homepage
│   ├── blog/          # Blog functionality
│   ├── sandbox/       # Development sandbox/demos
│   └── about/         # About page
├── layout.tsx         # Root layout with theme provider
└── globals.css        # Global styles

components/
├── ui/               # shadcn/ui components
├── layout/           # Header, footer components
├── theme/            # Theme provider, mode toggle
├── client/           # Client components
└── shared/           # Shared utilities

lib/
├── utils.ts          # Utility functions
├── prisma.ts         # Database client
└── generated/prisma/ # Generated Prisma client

prisma/
├── schema.prisma     # Database schema
├── migrations/       # Database migrations
└── scripts/seed.ts   # Database seeding
```

**Database Models:**
- `Contact` - Contact form submissions
- `Post` - Blog posts with tags relationship
- `Tag` - Post tags with many-to-many relationship
- `PostTag` - Junction table for post-tag relationships

**Key Configuration:**
- **TypeScript:** Strict mode with path aliases (`@/*`)
- **Next.js:** TypedRoutes enabled, React Compiler, cacheComponents, PPR experimental features
- **Biome:** 2-space indentation, double quotes, Tailwind class sorting enabled
- **Prisma:** Client output to `lib/generated/prisma`

**Development Guidelines from Cursor Rules:**
- Server Components first, Client Components only when necessary
- TypeScript strict mode enforced, no `any` types
- Tailwind CSS v4 utilities preferred over custom CSS
- Dark mode support via next-themes
- Japanese comments in code
- Gitmoji commit convention with prefixes (✨ feat:, 🐛 fix:, etc.)

**Important Documentation:**
- Comprehensive Next.js guides in `docs/nextjs-basic-principle/` (36 chapters)
- Frontend testing patterns in `docs/articles/frontend-unit-testing.md`
- Reference documentation before implementing data fetching, component design, caching, or authentication

**Testing Strategy:**
- Unit tests with Vitest
- Storybook for component development and testing
- Browser testing with Playwright available