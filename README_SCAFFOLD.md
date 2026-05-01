# MomentumOS Project Scaffold

The "MomentumOS" project has been successfully scaffolded with the following configuration:

## 🚀 Core Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Backend**: Supabase (SSR Auth & Database)

## 📁 Project Structure
```text
src/
├── app/
│   ├── layout.tsx              # Root layout with Sidebar & Topbar
│   ├── page.tsx                # Redirects to /dashboard
│   └── (dashboard)/
│       └── dashboard/
│           └── page.tsx        # Welcome Dashboard
├── components/
│   ├── ui/                     # Button, Card, Badge, Input
│   └── layout/                 # Sidebar, Topbar
├── lib/
│   ├── supabase/               # Auth Clients & Middleware
│   └── utils.ts                # cn() helper
├── hooks/
│   └── useUser.ts              # Auth hook placeholder
├── types/
│   └── database.types.ts       # Supabase types
└── styles/
    └── globals.css             # Tailwind v4 directives
```

## 🛠️ Key Components
- **Button**: Supports variants (primary, ghost, danger), sizes, and loading states.
- **Card**: Premium design with shadow-sm and rounded corners.
- **Badge**: Status indicators with soft color palettes.
- **Input**: Integrated label, hint, and error message support.
- **Layout**: Fixed 240px Sidebar and 56px Topbar matching the exact design specs.

## 🔐 Supabase Integration
- **Client**: `@supabase/ssr` implemented for both Browser and Server.
- **Middleware**: Session refresh logic applied to all routes.
- **Schema**: Initial migration includes a `profiles` table with automatic user creation via triggers.

## ⚙️ Environment Configuration
Template provided in `.env.local.example`. You will need to add your Supabase project credentials to start using the auth features.
