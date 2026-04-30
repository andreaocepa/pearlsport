# Pearlsport — Full MVP Development Prompt
> Hand this prompt to an AI coding agent (e.g. Claude Code, Cursor, Copilot Workspace) to build the complete MVP.

---

## 1. PROJECT OVERVIEW

You are building **Pearlsport** — a sports media website focused on local sports in **Lira, Lango, and Northern Uganda**. It is a news & match reports platform, similar to a local ESPN or BBC Sport, covering Football (primary), Athletics, Basketball, Boxing, Rugby, and Cricket.

**Domain:** pearlsport.it  
**Tagline:** "Northern Uganda's game"  
**Language:** English only  
**Users:** Public readers (no accounts) + small editorial team (3–6 writers, 1–2 editors, 1 super admin)  
**Monetisation:** None at launch — community service  

---

## 2. TECH STACK

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **State / data fetching:** TanStack Query (React Query v5) + Axios
- **UI state:** Zustand
- **Rich text editor:** Tiptap v2 (with Table, Image, Video embed, Slash commands extensions)
- **Icons:** Lucide React
- **Forms & validation:** React Hook Form + Zod
- **SEO:** next-seo
- **Date handling:** date-fns
- **Notifications:** react-hot-toast
- **Media upload UI:** react-dropzone
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js v5
- **Language:** TypeScript
- **ORM:** Prisma (with PostgreSQL)
- **Auth:** JWT (jsonwebtoken) + bcrypt + refresh token rotation
- **File handling:** Multer + Sharp (resize + WebP conversion)
- **Media storage:** Supabase Storage (images and video)
- **Security:** helmet.js + cors + express-rate-limit
- **Validation:** Zod
- **Search:** PostgreSQL full-text search via pg_trgm extension
- **Caching:** In-memory Node.js caching for hot articles and fixture lists
- **Deployment:** Render

### Database
- **PostgreSQL** hosted on Supabase (free tier)
- **Prisma** for schema management and migrations

### Infrastructure
- **Frontend:** Vercel
- **Backend API:** Render
- **Database:** Supabase (PostgreSQL)
- **Media:** Supabase Storage
- **Cache:** In-Memory Cache (Replaced Upstash)

---

## 3. BRAND & DESIGN SYSTEM

### Colour Palette
```
Pearl Red:    #C0160C  ← primary accent, badges, CTA buttons, active states
Deep Red:     #7F0E08  ← hover states on red elements
Light Red:    #FDECEA  ← section backgrounds, card tints, hero wash
Soft Red:     #FAD3CF  ← borders, dividers, inactive tabs
Blush Red:    #F5B8B3  ← hover surfaces, highlighted rows
Pure White:   #FFFFFF  ← primary page & card background
Warm White:   #FFF7F6  ← secondary / alternating section background
Dark Text:    #1A1A1A  ← headings, body text
Muted Text:   #6B7280  ← secondary text, meta info
Border:       #FAD3CF  ← card borders, dividers
```

### Typography
- Font: `Inter` from Google Fonts
- Hero headline: 26px / weight 700
- Section headline: 20px / weight 600
- Card title: 15px / weight 600
- Body text: 14px / weight 400 / line-height 1.7
- Labels/meta: 11px / weight 600 / uppercase / letter-spacing 0.07em

### Design Rules
- Navbar: **white** background, `#1A1A1A` logo text, Pearl Red active underline
- Page background: `#FFFFFF` with `#FFF7F6` for alternating sections
- Hero section: white card with a 4px Pearl Red left accent bar + `#FDECEA` background wash
- Sport tabs: Pearl Red active pill; inactive pills use `#FAD3CF` border with `#1A1A1A` text
- Article cards: white background, `#FAD3CF` border, 12px radius, soft `#FDECEA` hover wash
- Sport badges: Pearl Red background / white text for Football; `#FDECEA` bg / `#C0160C` text for others
- VS chip in fixtures: `#FDECEA` background, `#C0160C` text, `#FAD3CF` border
- Weekly fixture widget: white card, Pearl Red highlighted active day pill
- Primary buttons: Pearl Red bg / white text, Deep Red on hover
- No dark surfaces — the entire UI is light red blended with white

---

## 4. DATABASE SCHEMA (Prisma)

Create the file `prisma/schema.prisma` with the following models:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  role         Role      @default(WRITER)
  avatarUrl    String?
  bio          String?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  articles     Article[]
}

enum Role {
  WRITER
  EDITOR
  ADMIN
}

model Sport {
  id          String      @id @default(cuid())
  name        String      @unique   // "Football", "Athletics", etc.
  slug        String      @unique   // "football", "athletics"
  description String?
  isMain      Boolean     @default(false)  // true for Football
  order       Int         @default(0)
  articles    Article[]
  fixtures    Fixture[]
  teams       Team[]
}

model Article {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  excerpt         String        @db.VarChar(300)
  body            Json          // Tiptap JSON
  bodyText        String?       // Plain text for search indexing
  coverImageUrl   String?
  coverImageAlt   String?
  status          ArticleStatus @default(DRAFT)
  isFeatured      Boolean       @default(false)
  publishedAt     DateTime?
  metaTitle       String?
  metaDescription String?       @db.VarChar(160)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  author          User          @relation(fields: [authorId], references: [id])
  authorId        String
  sport           Sport         @relation(fields: [sportId], references: [id])
  sportId         String
  tags            Tag[]
  fixture         Fixture?      @relation(fields: [fixtureId], references: [id])
  fixtureId       String?       @unique
}

enum ArticleStatus {
  DRAFT
  REVIEW
  PUBLISHED
}

model Tag {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  articles Article[]
}

model Team {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  logoUrl     String?
  homeGround  String?
  district    String?   // "Lira", "Lango", "Gulu", etc.
  bio         String?
  foundedYear Int?
  sport       Sport     @relation(fields: [sportId], references: [id])
  sportId     String
  homeFixtures  Fixture[] @relation("HomeTeam")
  awayFixtures  Fixture[] @relation("AwayTeam")
  createdAt   DateTime  @default(now())
}

model Competition {
  id       String          @id @default(cuid())
  name     String
  slug     String          @unique
  season   String          // "2025/26"
  type     CompetitionType
  region   String?
  logoUrl  String?
  isActive Boolean         @default(true)
  sport    Sport           @relation(fields: [sportId], references: [id])
  sportId  String
  fixtures Fixture[]
}

enum CompetitionType {
  LEAGUE
  CUP
  FRIENDLY
  TOURNAMENT
}

model Fixture {
  id            String        @id @default(cuid())
  homeTeam      Team          @relation("HomeTeam", fields: [homeTeamId], references: [id])
  homeTeamId    String
  awayTeam      Team          @relation("AwayTeam", fields: [awayTeamId], references: [id])
  awayTeamId    String
  competition   Competition   @relation(fields: [competitionId], references: [id])
  competitionId String
  sport         Sport         @relation(fields: [sportId], references: [id])
  sportId       String
  kickoffTime   DateTime
  venue         String?
  status        FixtureStatus @default(UPCOMING)
  homeScore     Int?
  awayScore     Int?
  notes         String?
  matchReport   Article?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum FixtureStatus {
  UPCOMING
  LIVE
  COMPLETED
  POSTPONED
  CANCELLED
}

model Media {
  id          String   @id @default(cuid())
  url         String
  altText     String?
  width       Int?
  height      Int?
  sizeBytes   Int?
  uploadedBy  String
  createdAt   DateTime @default(now())
}
```

After creating the schema:
1. Run `npx prisma migrate dev --name init`
2. Run `npx prisma db seed` to seed: 6 sports (Football as `isMain: true`), sample competitions (Lango League, Lira District Cup), and 1 admin user

---

## 5. BACKEND — EXPRESS API

### Project structure
```
api/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── articles.ts
│   │   ├── fixtures.ts
│   │   ├── media.ts
│   │   ├── search.ts
│   │   ├── sports.ts
│   │   ├── teams.ts
│   │   ├── competitions.ts
│   │   └── users.ts
│   ├── controllers/       ← request/response handling
│   ├── services/          ← business logic
│   ├── middleware/
│   │   ├── auth.ts        ← verifyToken, requireRole
│   │   ├── errorHandler.ts
│   │   └── upload.ts      ← multer config
│   ├── utils/
│   │   ├── slugify.ts
│   │   ├── redis.ts
│   │   └── supabaseStorage.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Auth middleware
```typescript
// middleware/auth.ts
// verifyToken: checks Authorization: Bearer <token>
// requireRole(roles: Role[]): checks user role against allowed roles
// Roles: WRITER < EDITOR < ADMIN
```

### API Routes — full specification

#### Auth (no auth required)
```
POST   /api/v1/auth/login      { email, password } → { accessToken, refreshToken, user }
POST   /api/v1/auth/refresh    { refreshToken } → { accessToken }
POST   /api/v1/auth/logout     🔒 → invalidates refresh token
```

#### Articles (public reads, protected writes)
```
GET    /api/v1/articles                    ?sport=&tag=&status=published&page=&limit=
GET    /api/v1/articles/featured           → single featured article
GET    /api/v1/articles/:slug              → full article with author, sport, tags
POST   /api/v1/articles                    🔒 WRITER+ → create draft
PUT    /api/v1/articles/:id                🔒 WRITER+ (own) / EDITOR+ (any)
PATCH  /api/v1/articles/:id/submit         🔒 WRITER+ → set status REVIEW
PATCH  /api/v1/articles/:id/publish        🔒 EDITOR+ → set status PUBLISHED + publishedAt
PATCH  /api/v1/articles/:id/feature        🔒 ADMIN → toggle isFeatured
DELETE /api/v1/articles/:id                🔒 EDITOR+
```

#### Fixtures & Results
```
GET    /api/v1/fixtures                    ?sport=&week=current|next|prev&status=
GET    /api/v1/fixtures/:id
POST   /api/v1/fixtures                    🔒 EDITOR+
PUT    /api/v1/fixtures/:id                🔒 EDITOR+ (update score, status, venue)
DELETE /api/v1/fixtures/:id                🔒 ADMIN
GET    /api/v1/results                     ?sport=&limit=
```

#### Sports, Teams, Competitions (public reads)
```
GET    /api/v1/sports
GET    /api/v1/teams                       ?sport=
GET    /api/v1/teams/:slug
POST   /api/v1/teams                       🔒 EDITOR+
PUT    /api/v1/teams/:id                   🔒 EDITOR+
GET    /api/v1/competitions                ?sport=&isActive=true
POST   /api/v1/competitions                🔒 ADMIN
PUT    /api/v1/competitions/:id            🔒 ADMIN
```

#### Media
```
POST   /api/v1/media/upload                🔒 WRITER+
  - Accept: multipart/form-data (field: "image")
  - Process: Multer → Sharp resize to 3 sizes (thumbnail 320px, medium 800px, large 1600px) → WebP → upload to Supabase Storage bucket "media"
  - Returns: { url, storagePath, width, height }
DELETE /api/v1/media/:storagePath          🔒 EDITOR+
```

#### Search
```
GET    /api/v1/search?q=&sport=&page=
  - Full-text search on Article.title + Article.bodyText
  - Uses PostgreSQL pg_trgm: CREATE EXTENSION IF NOT EXISTS pg_trgm;
  - Returns paginated results with snippet
```

#### Users (admin only)
```
GET    /api/v1/users                       🔒 ADMIN
POST   /api/v1/users                       🔒 ADMIN → create writer/editor account
PUT    /api/v1/users/:id                   🔒 ADMIN
PATCH  /api/v1/users/:id/role              🔒 ADMIN → change role
PATCH  /api/v1/users/:id/deactivate        🔒 ADMIN
GET    /api/v1/users/me                    🔒 any auth → own profile
```

### In-Memory caching strategy
- Use a simple Node.js `Map` since we run on a single instance.
- Cache key `articles:featured` → TTL 60s
- Cache key `articles:list:{sport}:{page}` → TTL 30s
- Cache key `fixtures:week:{weekId}` → TTL 60s
- Invalidate relevant keys on POST/PUT/PATCH/DELETE mutations

---

## 6. FRONTEND — NEXT.JS APP

### Project structure
```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx            ← public layout with Navbar + Footer
│   │   ├── page.tsx              ← Homepage
│   │   ├── [sport]/
│   │   │   ├── page.tsx          ← Sport category page
│   │   │   └── [slug]/
│   │   │       └── page.tsx      ← Article detail page
│   │   ├── fixtures/
│   │   │   └── page.tsx          ← Weekly fixtures page
│   │   ├── results/
│   │   │   └── page.tsx          ← Results archive
│   │   ├── teams/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      ← Team profile page
│   │   ├── search/
│   │   │   └── page.tsx          ← Search results (CSR)
│   │   ├── about/
│   │   │   └── page.tsx          ← Static about page
│   │   └── contact/
│   │       └── page.tsx          ← Static contact page
│   └── (admin)/
│       ├── layout.tsx            ← Admin layout (auth check, sidebar)
│       ├── login/
│       │   └── page.tsx          ← Login page (CSR)
│       └── dashboard/
│           ├── page.tsx          ← Overview dashboard
│           ├── articles/
│           │   ├── page.tsx      ← Articles list
│           │   ├── new/
│           │   │   └── page.tsx  ← Create article
│           │   └── [id]/
│           │       └── page.tsx  ← Edit article
│           ├── fixtures/
│           │   └── page.tsx      ← Fixtures manager
│           ├── media/
│           │   └── page.tsx      ← Media library
│           └── team/
│               └── page.tsx      ← Writers management (Admin only)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── article/
│   │   ├── ArticleCard.tsx       ← Standard article card
│   │   ├── HeroCard.tsx          ← Featured hero article
│   │   ├── ArticleGrid.tsx       ← 3-column article grid
│   │   └── ArticleBody.tsx       ← Tiptap JSON renderer
│   ├── fixtures/
│   │   ├── FixtureWeekWidget.tsx ← Weekly day-strip widget
│   │   ├── FixtureRow.tsx
│   │   └── ResultRow.tsx
│   ├── editor/
│   │   └── TiptapEditor.tsx      ← Full rich text editor
│   ├── ui/
│   │   ├── SportBadge.tsx
│   │   ├── SportTabs.tsx
│   │   └── ShareBar.tsx          ← WhatsApp + copy link share
  │   └── MediaUpload.tsx       ← Supabase Storage upload component
│   └── seo/
│       └── ArticleSEO.tsx
├── lib/
│   ├── api.ts                    ← Axios instance + API helpers
│   └── utils.ts
├── hooks/
│   ├── useArticles.ts
│   ├── useFixtures.ts
│   └── useAuth.ts
└── types/
    └── index.ts                  ← All TypeScript types mirroring Prisma models
```

### Page-by-page rendering strategy
| Page | Strategy | Revalidate |
|---|---|---|
| Homepage | SSR | — |
| Sport category page | SSR | — |
| Article detail | ISR | 60 seconds |
| Fixtures page | SSR | — |
| Results page | SSR | — |
| Team profile | ISR | 300 seconds |
| About / Contact | SSG | Never |
| Search results | CSR | — |
| All admin pages | CSR | — |

### Key page specifications

#### Homepage (`app/(public)/page.tsx`)
1. **Hero section** — fetch featured article → `HeroCard` component (black background, red left accent bar, white text)
2. **Sport tabs** — horizontal pills: Football (red active) | Athletics | Basketball | Boxing | Rugby | All Sports
3. **Article grid** — 3 columns, filter by active sport tab, 6 articles per load
4. **Weekly fixtures widget** — `FixtureWeekWidget` showing current week, day navigation, all sports
5. **Load more** button for additional articles

#### Sport category page (`app/(public)/[sport]/page.tsx`)
1. Sport banner with name and latest featured article for that sport
2. Sub-tabs: News | Fixtures | Results
3. Article card grid filtered to that sport
4. Sidebar showing upcoming fixtures for that sport
5. Pagination

#### Article detail page (`app/(public)/[sport]/[slug]/page.tsx`)
1. Full-width cover image
2. Title, author name, date, sport badge
3. `ArticleBody` renders Tiptap JSON to HTML
4. `ShareBar` — WhatsApp share button (`https://wa.me/?text=`) + copy link button
5. Related articles section (same sport, 3 cards)
6. Tags strip at bottom
7. Full OpenGraph meta tags for social sharing

#### Fixtures page (`app/(public)/fixtures/page.tsx`)
1. Week navigator: `← Prev week | Mon 28 Apr – Sun 4 May | Next week →`
2. 7-day strip tabs (Mon–Sun), active day highlighted in red
3. Fixture rows per day: Competition · Home Team vs Away Team · Time / Score · Venue
4. Sport filter tabs at top (All | Football | Athletics | etc.)
5. Results tab shows completed fixtures with scores

#### Admin article editor (`app/(admin)/dashboard/articles/new/page.tsx` and `/[id]/page.tsx`)
Full `TiptapEditor` with:
- Toolbar: Bold, Italic, Headings (H2/H3), Bullet list, Numbered list, Blockquote, Table (insert/delete rows/cols), Image upload (via `/api/v1/media/upload`), YouTube/video embed, Link, Horizontal rule, Slash commands
- Article metadata sidebar: Title, Excerpt, Cover image upload, Sport selector, Tags input, Meta title, Meta description
- Status bar: Save draft, Submit for review (Writer), Publish (Editor+), Feature toggle (Admin)
- Auto-save draft every 30 seconds

---

## 7. SHARED COMPONENTS — DETAILED SPECS

### `Navbar.tsx`
- Background: `#111111`, always full width
- Logo: red dot + "Pearlsport" in white
- Links: Home | Football ▾ | Sports ▾ | Fixtures | Results | Search icon
- Football dropdown: Latest Football News, Fixtures & Results, Lango League, Lira District Cup, Local Teams, Match Reports
- Sports dropdown: Athletics, Basketball, Boxing, Rugby, Cricket, Other Sports
- Mobile: hamburger menu, Football and Fixtures pinned as quick links
- Admin users see an extra "Dashboard" link

### `HeroCard.tsx`
- Black (`#111`) background
- 3–4px left red accent bar (`#C0160C`)
- Red badge (sport + article type e.g. "FOOTBALL · MATCH REPORT")
- Large white title (20–26px)
- Author + date byline in muted grey
- Full clickable card linking to article

### `ArticleCard.tsx`
- Cover image (aspect ratio 16:9), lazy loaded
- Red sport badge overlay on image (bottom left)
- Title (15px / 500)
- Author + relative time (e.g. "3h ago")
- Hover: slight border colour intensification

### `FixtureWeekWidget.tsx`
- Black header bar: "This week's fixtures" + Prev/Next week arrows
- 7 day pills (Mon–Sun), clicking changes active day (red highlight)
- Fixture rows: `[Competition] [Home Team] VS [Away Team] [Time]`
- If fixture is COMPLETED: show score instead of time e.g. `2 – 1`
- VS chip styled: red text, light red background, red border
- Non-football fixtures shown with reduced opacity (0.6)

### `ShareBar.tsx`
- WhatsApp button: opens `https://wa.me/?text=Check this out on Pearlsport: [title] [url]`
- Copy link button: copies URL to clipboard, shows "Copied!" toast for 2s
- Positioned after article body, before related articles

### `SportBadge.tsx`
- Football: red background `#C0160C`, white text
- Athletics: `#111` background, white text
- Boxing: `#7F0E08` background, white text
- Other sports: `#1A1A1A` background, white text
- Size variants: sm (10px) and md (11px)

---

## 8. AUTHENTICATION FLOW

- JWT access token: 15 minute expiry, stored in memory (not localStorage)
- Refresh token: 7 day expiry, stored in httpOnly cookie
- On app load: attempt silent refresh via `/api/v1/auth/refresh`
- Auth context (`useAuth` hook) provides: `user`, `isAuthenticated`, `login()`, `logout()`
- Admin route protection: `app/(admin)/layout.tsx` redirects to `/login` if not authenticated
- Role-based UI: hide/show buttons (Publish, Feature, Manage Team) based on user role

---

## 9. SEO IMPLEMENTATION

For every article page generate:
```html
<title>{article.metaTitle || article.title} | Pearlsport</title>
<meta name="description" content="{article.metaDescription || article.excerpt}" />
<meta property="og:title" content="{article.title}" />
<meta property="og:description" content="{article.excerpt}" />
<meta property="og:image" content="{article.coverImageUrl}" />
<meta property="og:url" content="https://pearlsport.it/{sport.slug}/{article.slug}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

Also generate:
- `/sitemap.xml` — dynamic, includes all published articles + sport pages
- `/robots.txt` — allow all, point to sitemap
- JSON-LD Article structured data on each article page

---

## 10. ENVIRONMENT VARIABLES

### Backend (`api/.env`)
```
DATABASE_URL=postgresql://...
# (Upstash Redis removed in favor of in-memory cache)
JWT_SECRET=<random 64-char string>
JWT_REFRESH_SECRET=<different random 64-char string>
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key>
SUPABASE_STORAGE_BUCKET=media
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_URL=https://pearlsport.it
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

---

## 11. MVP SCOPE — WHAT TO BUILD FIRST

### In scope for MVP
- [ ] Full database schema + Prisma migrations + seed data
- [ ] All backend API routes listed in Section 5
- [ ] Homepage with hero, sport tabs, article grid, fixtures widget
- [ ] Sport category pages (Football primary)
- [ ] Article detail page with full body rendering + share bar
- [ ] Fixtures page with weekly view and day navigation
- [ ] Results page
- [ ] Global search
- [ ] Admin CMS: login, dashboard, article list, article editor (Tiptap), fixtures manager
- [ ] Writer/editor/admin role system
- [ ] Image upload via Supabase Storage
- [ ] SEO meta tags on all public pages
- [ ] Responsive design (mobile first)

### Out of scope for MVP (build later)
- Reader accounts / comments / likes
- Live score real-time updates (WebSocket)
- Video highlights section
- Player profiles database
- Team standings / league tables
- PWA / offline support
- Luo language toggle
- Monetisation / ads
- Email notifications to writers on publish

---

## 12. MONOREPO STRUCTURE

```
pearlsport/
├── web/                  ← Next.js frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── api/                  ← Express backend
│   ├── src/
│   ├── prisma/
│   └── package.json
├── .github/
│   └── workflows/
│       ├── deploy-web.yml    ← Auto-deploy to Vercel on push to main
│       └── deploy-api.yml    ← Auto-deploy to Render on push to main
└── README.md
```

Use separate `package.json` files for `web/` and `api/`. No need for a monorepo tool like Turborepo for MVP — keep it simple.

---

## 13. DEVELOPMENT ORDER (recommended for agent)

Build in this sequence to unblock work at each step:

1. **Database** — Prisma schema, migrations, seed script
2. **Auth API** — login, JWT middleware, role checks
3. **Articles API** — full CRUD + publish flow + search
4. **Fixtures API** — full CRUD + week filter
5. **Media API** — Cloudinary upload + Sharp processing
6. **Teams & Competitions API** — CRUD
7. **Frontend: Navbar + layout** — responsive shell
8. **Frontend: Homepage** — hero + sport tabs + article grid + fixtures widget
9. **Frontend: Article detail page** — body render + SEO + share bar
10. **Frontend: Sport category page**
11. **Frontend: Fixtures page** — weekly view
12. **Frontend: Search page**
13. **Admin: Login page + auth context**
14. **Admin: Dashboard + article list**
15. **Admin: Tiptap article editor**
16. **Admin: Fixtures manager**
17. **Admin: Media library**
18. **Admin: Writers management (Admin role only)**
19. **SEO** — sitemap, robots.txt, JSON-LD, OG tags
20. **Polish** — loading states, error pages (404/500), empty states

---

## 14. STARTER SEED DATA

Include in `prisma/seed.ts`:

**Sports (in order):**
1. Football — slug: `football` — isMain: true
2. Athletics — slug: `athletics`
3. Basketball — slug: `basketball`
4. Boxing — slug: `boxing`
5. Rugby — slug: `rugby`
6. Cricket — slug: `cricket`

**Competitions:**
- Lango Super League (Football, LEAGUE, season: 2025/26)
- Lira District Cup (Football, CUP, season: 2025)
- Lango Regional Athletics Championships (Athletics, TOURNAMENT, season: 2025)

**Teams (Football):**
- Lira FC — district: Lira
- Gulu United — district: Gulu
- Kitgum SC — district: Kitgum
- Apach FC — district: Apach
- Lango Martyrs FC — district: Lango

**Admin user:**
- email: `admin@pearlsport.it`
- password: `Admin@2025` (hashed with bcrypt)
- role: ADMIN
- name: Site Admin

---

*End of Pearlsport MVP Development Prompt*  
*Planned & designed at: https://claude.ai*
