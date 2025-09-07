# Directory Structure

## Main Directories

### app/
- `(public)/` - Public pages group
  - `layout.tsx` - Public layout
  - `page.tsx` - Homepage
  - `blog/` - Blog functionality
  - `sandbox/` - Development sandbox/demos
  - `about/` - About page
- `layout.tsx` - Root layout with theme provider
- `globals.css` - Global styles

### components/
- `ui/` - shadcn/ui components
- `layout/` - Header, footer components
- `theme/` - Theme provider, mode toggle
- `client/` - Client components
- `shared/` - Shared utilities

### lib/
- `utils.ts` - Utility functions
- `prisma.ts` - Database client
- `generated/prisma/` - Generated Prisma client

### prisma/
- `schema.prisma` - Database schema
- `migrations/` - Database migrations
- `scripts/seed.ts` - Database seeding

### Configuration Files
- `.storybook/` - Storybook configuration
- `docs/` - Project documentation
- `public/` - Static assets
- `util/` - Utility scripts