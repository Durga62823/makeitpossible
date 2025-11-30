<div align="center">
  <h1>Make It Possible</h1>
  <p>AI-powered project management platform with enterprise-grade authentication.</p>
</div>

## Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js v5 (JWT strategy) with Credentials, Google, GitHub
- **Sessions:** Redis (Upstash) + NextAuth secure cookies
- **State:** Zustand for lightweight client auth context
- **Forms:** React Hook Form + Zod validation
- **Email:** Resend + React Email templates

## Getting Started

1. **Install dependencies**
	```bash
	npm install
	```
2. **Copy environment variables**
	```bash
	cp .env.example .env.local
	```
	Fill in PostgreSQL, Redis/Upstash, Resend, and OAuth credentials.
3. **Set up the database**
	```bash
	npx prisma generate
	npx prisma migrate dev
	```
4. **Run the development server**
	```bash
	npm run dev
	```
	Visit [http://localhost:3000](http://localhost:3000).

## OAuth Credentials

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth consent screen → External or Internal
3. Add scopes (`email`, `profile`)
4. Create credentials → OAuth Client ID (Web)
5. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub
1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App → Homepage URL `http://localhost:3000`
3. Authorization callback URL `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret into `.env.local`

## Environment Variables

See `.env.example` for the complete list:

- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` – NextAuth configuration
- `GOOGLE_*`, `GITHUB_*` – OAuth credentials
- `UPSTASH_REDIS_REST_*`, `REDIS_URL` – session cache and rate limiting
- `RESEND_API_KEY`, `EMAIL_FROM` – outbound email service
- `NEXT_PUBLIC_APP_URL` – Base URL for links in emails and metadata

## Database & Prisma

- All models defined in `prisma/schema.prisma`
- Generated client: `npx prisma generate`
- Create migrations: `npm run prisma:migrate`
- Deploy to production: `npm run prisma:deploy`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with Next.js rules |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Create and apply a new migration |
| `npm run prisma:deploy` | Apply migrations in production |

## Production Build

```bash
npm run build
npm run start
```

The build step runs type-checking, ESLint, and compiles Server/Client components. Security headers and CSP are configured via `next.config.ts`.

## Folder Structure (excerpt)

```
app/
	(auth)/
		layout.tsx
		auth/
			login|signup|forgot-password|reset-password|verify-email
	actions/ ... Server Actions for auth & password flows
	api/ ... NextAuth + register endpoint
	dashboard/ ... protected workspace
components/
  auth/ ... auth-specific UI
  ui/ ... shadcn/ui primitives
emails/ ... React Email templates
lib/ ... Prisma, Redis, NextAuth, validations, utils
prisma/ ... schema + migrations
```

## Security & Compliance

- Bcrypt password hashing (salt rounds = 10)
- JWT sessions with device tracking and rate limiting
- CSP, HSTS, and secure cookies enabled
- Server Actions plus Zod + RHF validation for all forms
- CSRF protection via NextAuth
- Input sanitization + logging via pino

## Deployment

1. Provision PostgreSQL and Redis (Upstash)
2. Configure environment variables on hosting provider (Vercel recommended)
3. Run `npm run prisma:deploy`
4. Deploy via `vercel --prod` or your preferred workflow

## Support

Please open an issue or reach out to the platform team if you need enterprise SSO, SCIM, or custom SLA support.
