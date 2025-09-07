# Project Overview

## Purpose
Next.js 15 App Router Blog Application - A modern blog platform with PostgreSQL database, TypeScript strict mode, and modern React features.

## Tech Stack
- **Framework:** Next.js 15 with App Router, React 19 beta
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI components
- **Code Quality:** Biome for formatting/linting
- **Testing:** Vitest, Storybook with addon-vitest
- **State Management:** XState for complex state logic
- **Package Manager:** pnpm

## Key Features
- Blog functionality with posts and tags
- Contact form submissions
- Dark mode support (next-themes)
- Component development with Storybook
- Database management with Prisma

## Database Models
- `Contact` - Contact form submissions
- `Post` - Blog posts with tags relationship
- `Tag` - Post tags with many-to-many relationship
- `PostTag` - Junction table for post-tag relationships