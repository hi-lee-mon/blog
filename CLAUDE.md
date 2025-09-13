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


## コーディング時に利用可能なツールについて
コーディングを効率的に行う為のツールです。必ず以下に目を通してください。

### Serena MCP ― コード検索・編集ツールセット（必ず優先）
| 分類 | 主要ツール (mcp__serena__) | 典型的な用途 |
|------|---------------------------|--------------|
| **ファイル / ディレクトリ** | `list_dir` / `find_file` | ツリー俯瞰・ファイル名で高速検索 |
| **全文検索** | `search_for_pattern` / `replace_regex` | 正規表現を含む横断検索・一括置換 |
| **シンボル検索** | `get_symbols_overview` / `find_symbol` / `find_referencing_symbols` | 定義探索・参照逆引き |
| **シンボル編集** | `insert_after_symbol` / `insert_before_symbol` / `replace_symbol_body` | 挿入・追記・リファクタ |
| **メモリ管理** | `write_memory` / `read_memory` / `list_memories` / `delete_memory` | `.serena/memories/` への長期知識 CRUD |
| **メンテナンス** | `restart_language_server` / `switch_modes` / `summarize_changes` / `prepare_for_new_conversation` | LSP 再起動・モード切替・変更要約・新チャット準備 |

> **禁止**: 組み込み `Search / Read / Edit / Write` ツールは使用しない。
> **ロード手順**: チャット開始直後に `/mcp__serena__initial_instructions` を必ず実行してから作業を行う。

Serena MCPが使えない環境では仕方ないので通常の `Search / Read / Edit / Write` を使用しても良いが、Serena MCPの機能を優先的に利用すること。

### Gemini CLI ― Web 検索専用

外部情報を取得する必要がある場合は、次の Bash ツール呼び出しを **唯一の手段として使用** する。

```bash
gemini --prompt "WebSearch: <query>"