<div align="center">

# Finvoro

**Personal finance tracker with budgets, goals, reports, and an AI copilot.**

[![Live Demo](https://img.shields.io/badge/demo-finvoro--finance.vercel.app-000000?style=flat&logo=vercel&logoColor=white)](https://finvoro-finance.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#-license)

[Live Demo](https://finvoro-finance.vercel.app/) 

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🧭 Overview

Finvoro is a full-stack personal finance app for people who want a clear view of where their money goes. You log income and expenses, organize them into categories, set monthly budgets and savings goals, and get dashboards and reports that summarize the result. An AI copilot (Google Gemini) can answer questions about your data, categorize transactions, parse plain-English entries, and read receipts.

Data is scoped per user through Clerk authentication, and AI features can be switched off per account from the settings page.

---

## ✨ Features

**Core finance tracking**
- 💸 **Transactions**: add, edit, and delete income and expenses with search, filters, and URL-synced table state
- 🏷️ **Categories**: custom categories with icons and colors
- 📅 **Budgets**: per-category monthly budgets with progress tracking and over-budget alerts
- 🎯 **Goals**: savings goals with target amounts, target dates, and contributions
- 🔔 **Notifications**: in-app alerts, including budget warnings

**Dashboard and reports**
- 📊 **Dashboard**: KPI cards, cashflow chart, spending breakdown, budget progress, recent transactions, goals, and detected subscriptions
- ❤️ **Financial health score** and **cashflow forecast**
- 📈 **Reports**: date-range filtering, spending by category, income/expense trends, and smart insights
- 📤 **CSV export** for transactions and reports, plus a full data export

**AI (Google Gemini)**
- 🤖 **Copilot chat** with tool calling against your own financial data and draft transactions you can confirm before saving
- 🧠 **Natural-language entry**: "Lunch 450 yesterday" becomes a structured transaction
- 🧾 **Receipt scanning** from an image
- 🏷️ **Auto-categorization** and **budget suggestions**
- 💡 **Insights** on the dashboard and reports
- 🔒 Per-user opt-out, plus in-memory rate limiting on AI routes

**Experience**
- 🌗 Light and dark themes
- ⌨️ Command palette (`cmdk`) with global search
- 💱 Configurable display currency (defaults to INR)
- 🧪 One-click sample data loader and a "clear all data" action in settings
- 🌐 Marketing landing page with smooth scrolling (Lenis) and Framer Motion animations

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, `tw-animate-css`, shadcn/ui components built on `@base-ui/react`
- **State:** Zustand
- **Forms and validation:** React Hook Form, Zod
- **Data display:** TanStack Table, Recharts, `react-markdown` with `remark-gfm`
- **UX:** Framer Motion, Lenis, Sonner (toasts), `next-themes`, Lucide icons

### Backend and Database
- **Database:** PostgreSQL
- **ORM:** Prisma 7 with the `@prisma/adapter-pg` driver adapter
- **Auth:** Clerk (`@clerk/nextjs`)
- **AI:** Google Gemini via `@google/genai`
- **API:** Next.js Route Handlers and Server Actions

### Tools
- **Testing:** Vitest
- **Linting:** ESLint 9 with `eslint-config-next`
- **Scripting:** `tsx`
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 20.19` (Node 22 LTS recommended)
- **npm** `>= 10` (a `package-lock.json` is committed; pnpm or yarn will also work)
- A **PostgreSQL** database (local, Docker, Neon, Supabase, Vercel Postgres, etc.)
- A **[Clerk](https://clerk.com/)** application (free tier is fine)
- A **[Gemini API key](https://aistudio.google.com/apikey)** to enable the AI features

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Sushmitha-SK/Finvoro.git
cd Finvoro
```

**2. Install dependencies**

```bash
npm install
```

> `postinstall` runs `prisma generate` automatically, so the Prisma client is created in `src/generated/prisma`.

**3. Configure environment variables**

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables) for details):

```bash
touch .env
```

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finvoro"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxx"

# Gemini
GEMINI_API_KEY="your-gemini-api-key"
```

> Use a single `.env` file. The Prisma CLI config loads it via `dotenv`, and Next.js reads it at runtime.

**4. Apply database migrations**

```bash
npm run db:migrate
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, then go to **Settings** and use **Load sample data** to populate the dashboard with demo transactions.

---

## 🔐 Environment Variables

| Variable | Required | Example | Description |
| --- | :---: | --- | --- |
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host:5432/finvoro` | PostgreSQL connection string used by Prisma at runtime and by the Prisma CLI for migrations. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | `pk_test_...` | Clerk publishable key, exposed to the browser. |
| `CLERK_SECRET_KEY` | ✅ | `sk_test_...` | Clerk secret key, server-side only. Never commit it. |
| `GEMINI_API_KEY` | ➖ | `AIza...` | Enables the AI copilot, insights, receipt scanning, parsing, and categorization. Without it, AI features report as unconfigured. |
| `GEMINI_MODEL` | ➖ | `gemini-3.5-flash` | Main model for chat and reasoning. This is the default when unset. |
| `GEMINI_FAST_MODEL` | ➖ | `gemini-3.5-flash-lite` | Lighter model for latency-sensitive structured tasks. This is the default when unset. |
| `GEMINI_THINKING` | ➖ | `off` | Set to `off` to disable the model's thinking step and reduce latency. |

> **Clerk routes:** if you customize sign-in or sign-up paths, also set Clerk's `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL`. The app ships with `/sign-in` and `/sign-up` routes.

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server at `http://localhost:3000`. |
| `npm run build` | Generate the Prisma client, then create a production build. |
| `npm run start` | Serve the production build (run `build` first). |
| `npm run lint` | Lint the codebase with ESLint. |
| `npm run typecheck` | Generate Next.js route types and run `tsc --noEmit`. |
| `npm run test` | Run the Vitest suite once. |
| `npm run db:generate` | Regenerate the Prisma client. |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`). |
| `npm run verify:data` | Run `scripts/verify-data.ts`, an integration check of seeding, budgets, reports, AI tools, and per-user data isolation. It writes to the database in `DATABASE_URL`, so run it against a dev database only. |

---

## 🗂️ Project Structure

```text
Finvoro/
├── prisma/
│   ├── schema.prisma              # Category, Transaction, Budget, Goal, Notification, UserPreference
│   └── migrations/                # SQL migrations
├── scripts/
│   └── verify-data.ts             # Data-layer verification script
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── (dashboard)/           # Authenticated area
│   │   │   ├── dashboard/
│   │   │   ├── transactions/      # page + server actions
│   │   │   ├── categories/
│   │   │   ├── budgets/
│   │   │   ├── goals/
│   │   │   ├── reports/
│   │   │   ├── copilot/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── ai/                # chat, insights, scan-receipt, parse-transaction, categorize, budget-suggestions, status
│   │   │   ├── transactions/export/
│   │   │   ├── reports/export/
│   │   │   ├── data/export/
│   │   │   ├── categories/ budgets/ notifications/ preferences/ search/
│   │   ├── sign-in/ sign-up/      # Clerk auth pages
│   │   ├── layout.tsx             # Root layout (ClerkProvider)
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── dashboard/ transactions/ categories/ budgets/ goals/
│   │   ├── reports/ copilot/ ai/ notifications/ settings/
│   │   ├── landing/               # Marketing sections
│   │   ├── layout/ command/ providers/ shared/
│   ├── config/                    # Navigation and landing content
│   ├── hooks/                     # Reusable React hooks
│   ├── lib/
│   │   ├── ai/                    # Gemini client, tools, schemas, rate limiting
│   │   ├── data/                  # Data access: dashboard, budgets, goals, analytics, seed
│   │   ├── transactions/          # Transaction queries
│   │   ├── auth.ts env.ts prisma.ts csv.ts currencies.ts format-currency.ts ...
│   ├── stores/                    # Zustand stores
│   ├── types/                     # Shared TypeScript types
│   ├── assets/                    # Logos and images
│   └── proxy.ts                   # Clerk middleware protecting dashboard routes
├── prisma7.config.ts              # Prisma CLI configuration
├── vitest.config.ts
├── next.config.ts
└── package.json
```

---

## ☁️ Deployment

The app is deployed on [Vercel](https://vercel.com/) at **[finvoro-finance.vercel.app](https://finvoro-finance.vercel.app/)**. To deploy your own copy:

**1. Provision a PostgreSQL database**

Use any hosted Postgres provider (Neon, Supabase, Vercel Postgres, etc.) and copy the connection string.

**2. Import the repository into Vercel**

Push your fork to GitHub, then choose **Add New → Project** in the Vercel dashboard and import it. Vercel detects Next.js automatically. The default build command (`npm run build`) already runs `prisma generate`.

**3. Add environment variables**

In **Project Settings → Environment Variables**, add `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and the `GEMINI_*` variables. Use Clerk **production** keys for a production deployment, and add your Vercel domain to the Clerk application's allowed domains.

**4. Run migrations against the production database**

Migrations are not applied during the Vercel build. Run them once from your machine, and again whenever the schema changes:

```bash
DATABASE_URL="your-production-connection-string" npm run db:migrate
```

**5. Deploy**

```bash
git push origin main
```

Vercel builds and deploys on every push. Alternatively, use the CLI:

```bash
npm i -g vercel
vercel --prod
```

> ⚠️ **Rate limiting:** the AI routes use an in-memory sliding-window limiter. On serverless platforms each instance keeps its own counters, so limits are approximate. For a hard global cap, swap it for a shared store such as Upstash Redis (see `src/lib/ai/rate-limit.ts`).

---

