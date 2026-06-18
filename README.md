# Bethel Empire – E-Commerce Platform

Premium handcrafted bags e-commerce built with Next.js 14, PostgreSQL, Prisma, and Paystack.

## 🎨 Brand Colors
- **Gold**: `#C9A84C` (primary accent)
- **Gold Light**: `#E8C97A`
- **Empire Black**: `#0A0A0A`
- **Empire Charcoal**: `#1A1A1A` (admin sidebar, dark sections)

## 🚀 Quick Start

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set up environment variables
\`\`\`bash
cp .env.local.example .env.local
# Fill in your DATABASE_URL, NEXTAUTH_SECRET, Paystack keys, etc.
\`\`\`

### 3. Set up the database
\`\`\`bash
# Push schema to your PostgreSQL database
npm run db:push

# Seed with sample data + admin user
npm run db:seed
\`\`\`

### 4. Run development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

After seeding, log in at `/admin/login` with:
- **Email**: `admin@bethelempire.com`
- **Password**: `Admin@BethelEmpire2025`

> ⚠️ Change the admin password immediately after first login in production!

## 📁 Key Directories

\`\`\`
bethel-empire/
├── app/
│   ├── (shop)/          # Public store pages
│   ├── (auth)/          # Login, register
│   ├── admin/           # Admin dashboard (protected)
│   └── api/             # API routes
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Navbar, Footer
│   └── admin/           # Admin-specific components
├── lib/                 # Prisma, auth, utils, paystack
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── types/               # TypeScript types
\`\`\`

## 🗄️ Recommended Free Database Hosts
- **Supabase**: https://supabase.com (generous free tier)
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

## 🌐 Deployment (Vercel)
1. Push repo to GitHub
2. Connect repo on vercel.com
3. Add all environment variables in Vercel dashboard
4. Deploy!

## 📦 Phase Status
- [x] **Phase 1**: Foundation, DB schema, Auth, Admin login
- [ ] Phase 2: All content pages (12 pages)
- [ ] Phase 3: Products, Cart
- [ ] Phase 4: Checkout + Paystack
- [ ] Phase 5: Training + Registration
- [ ] Phase 6: SEO, Polish, Launch
