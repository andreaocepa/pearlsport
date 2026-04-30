# Pearlsport MVP Walkthrough

The MVP scaffold for Pearlsport has been fully developed based on the updated light red and white design system. Here's a breakdown of what was accomplished:

## Monorepo Scaffold
The project has been set up as a simple monorepo containing two directories:
- `api/`: The Express.js backend.
- `web/`: The Next.js 14 frontend.

## 1. Backend API (`api/`)

The backend is fully configured to use **Render**, **Supabase PostgreSQL**, and **Supabase Storage** for media.

- **Prisma Schema**: Completed with models for `User`, `Sport`, `Article`, `Tag`, `Team`, `Competition`, `Fixture`, and `Media`. Run `npm run seed` to insert starter data (football teams, competitions, sports, and an admin user).
- **Authentication**: JWT-based access and refresh tokens via httpOnly cookies.
- **REST Routes**: Full CRUD routes built out for `/auth`, `/articles`, `/fixtures`, `/teams`, `/competitions`, `/users`, and `/sports`.
- **Media Upload**: `multer` + `sharp` middleware handles image uploads, resizing them into 3 sizes (thumbnail, medium, large), converting to WebP, and uploading them to a Supabase Storage bucket.
- **Search Engine**: A `/search` endpoint using a Prisma raw query with PostgreSQL's `ILIKE` for full-text search across article titles and bodies.
- **Caching**: Simple Node.js in-memory `Map` is integrated for caching hot paths (e.g., featured article, weekly fixtures) without needing external services.

## 2. Frontend App (`web/`)

The Next.js 14 frontend implements the new "Light Red + White" brand aesthetic (`#C0160C`, `#FDECEA`, `#FAD3CF`).

### Public Pages
- **Global UI**: Custom `globals.css` with component classes (`.btn-primary`, `.card`, `.badge-football`).
- **Layout**: Clean `Navbar` with dropdowns and a `Footer`.
- **Homepage (`/`)**: Displays the `HeroCard`, `ArticleCard` grid, and the functional `FixtureWeekWidget` which uses a 7-day strip layout to filter daily fixtures.
- **Article Detail (`/[sport]/[slug]`)**: Dynamic page with a hero image cover, metadata, a Tiptap `ArticleBody` renderer, and a `ShareBar` (WhatsApp + Copy Link).
- **Categories & Discovery**: Built out `/football`, `/fixtures`, `/results`, and `/search` pages using mock data to demonstrate the UI layout.

### Admin CMS
- **Authentication (`/login`)**: Email/password form wired up to a Zustand `useAuth` store.
- **Dashboard (`/dashboard`)**: Protected layout with `AdminSidebar` containing quick actions and stats.
- **Articles Manager (`/dashboard/articles`)**: Table view for listing articles with filtering by status.
- **Tiptap Editor (`/dashboard/articles/new`)**: A fully featured rich-text editor using `@tiptap/react` supporting Headings, Bold, Italic, Quotes, Lists, Links, Images, and YouTube embeds.
- **Data Management**: UI pages created for `/dashboard/fixtures` (Fixtures & Results), `/dashboard/media` (Media Library), and `/dashboard/team` (User roles).

## Next Steps

To run the application locally:

1. **Backend**:
   - `cd api`
   - Fill in your `.env` based on `.env.example`.
   - `npm run db:migrate` then `npm run seed`
   - `npm run dev`

2. **Frontend**:
   - `cd web`
   - Fill in your `.env.local` based on `.env.local.example`.
   - `npm run dev`
