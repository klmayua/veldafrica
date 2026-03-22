# VELD AFRICA Website + CMS

A world-class Next.js 14 platform for VELD AFRICA - Africa's premier real estate investment gateway. Includes public website, admin dashboard with RBAC, newsletter system, and AI chatbot.

## ✨ Features

### Public Website
- **Modern Stack**: Next.js 14 + TypeScript + Tailwind CSS
- **Responsive Design**: Mobile-first with glassmorphism UI
- **SEO Ready**: Meta tags, Open Graph, structured data
- **Animations**: Framer Motion for smooth interactions
- **Chatbot**: AI-powered property assistant

### Admin CMS
- **Authentication**: NextAuth.js with role-based access
- **RBAC**: Super Admin, Admin, Editor, Viewer roles
- **Project Management**: Create and manage property developments
- **Property Listings**: Full CRUD with image galleries
- **Newsletter System**: Draft → Publish → Send workflow
- **Subscription Management**: Double opt-in, segmentation
- **Analytics**: Email open/click tracking

## 🎨 Brand Colors

- **Forest Green**: `#1B4D3E` - Primary brand color
- **Emerald**: `#2D6A4F` - Secondary green
- **Gold**: `#C9A227` - Premium accent
- **Sand**: `#D4C5B0` - Warm neutral
- **Cream**: `#FAF9F6` - Background

## 🏗️ Project Structure

```
veld-africa-web/
├── src/
│   ├── app/
│   │   ├── (public)/           # Marketing website
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── login/          # Admin login
│   │   │   ├── projects/       # Project management
│   │   │   ├── properties/     # Property CRUD
│   │   │   ├── newsletters/    # Newsletter editor
│   │   │   └── subscribers/    # Subscriber management
│   │   └── api/                # API routes
│   │       ├── admin/          # Admin APIs
│   │       ├── subscribe/      # Subscription APIs
│   │       └── chat/           # Chatbot API
│   ├── components/
│   │   ├── sections/            # Page sections
│   │   ├── shared/              # Shared components
│   │   │   ├── Navbar.tsx
│   │   │   └── Chatbot.tsx      # AI chat widget
│   │   └── ui/                  # UI primitives
│   ├── lib/
│   │   ├── auth.ts              # NextAuth config
│   │   ├── prisma.ts            # Database client
│   │   └── permissions.ts         # RBAC utilities
│   └── types/
│       └── next-auth.d.ts       # Auth types
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
└── docs/                        # Business documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Resend API key (for emails)

### Installation

```bash
# Clone repository
cd veld-africa-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Set up database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/veld_africa"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Email
RESEND_API_KEY="re_xxxxxxxx"
FROM_EMAIL="hello@veldafrica.com"

# App
APP_URL="http://localhost:3000"
```

### Access

**Public Website**: http://localhost:3000

**Admin Panel**: http://localhost:3000/admin

**Demo Credentials**:
- Super Admin: `admin@veldafrica.com` / `password`
- Editor: `editor@veldafrica.com` / `password`
- Viewer: `viewer@veldafrica.com` / `password`

## 📊 RBAC System

| Role | Projects | Properties | Newsletters | Users |
|------|----------|------------|-------------|-------|
| SUPER_ADMIN | Full | Full | Full | Full |
| ADMIN | Full | Full | Send | Manage |
| EDITOR | Edit* | Full | Edit | View |
| VIEWER | View* | View | View | None |

*Only assigned projects

## 📧 Newsletter Workflow

1. **Draft**: Create in rich text editor
2. **Preview**: Test send to admins
3. **Schedule**: Set publication date
4. **Publish**: Make publicly available
5. **Send**: Distribute to subscribers
6. **Analyze**: Track opens and clicks

## 🤖 Chatbot Features

- **Intent Recognition**: Properties, pricing, agro, diaspora, contact
- **Lead Capture**: Name, email, phone collection
- **Quick Actions**: Navigate to sections, schedule consultation
- **Context Aware**: Based on current page

## 📦 API Endpoints

### Projects
```
GET    /api/admin/projects
POST   /api/admin/projects
PUT    /api/admin/projects/[id]
DELETE /api/admin/projects/[id]
```

### Properties
```
GET    /api/admin/properties
POST   /api/admin/properties
PUT    /api/admin/properties/[id]
DELETE /api/admin/properties/[id]
```

### Newsletters
```
GET    /api/admin/newsletters
POST   /api/admin/newsletters
POST   /api/admin/newsletters/[id]/publish
POST   /api/admin/newsletters/[id]/send
```

### Subscriptions
```
POST   /api/subscribe
GET    /api/subscribe/confirm
GET    /api/unsubscribe
```

### Chat
```
POST   /api/chat
GET    /api/chat/[sessionId]
```

## 🏭 Production Deployment

### Build
```bash
npm run build
```

### Database Migration
```bash
npx prisma migrate deploy
```

### Deployment Platforms
- **Vercel**: `vercel --prod`
- **Railway**: Connect GitHub repo
- **AWS**: Deploy to EC2 or ECS

## 📚 Documentation

- [Business Documentation](/docs) - Manifesto, GTM Strategy, Brand Identity
- [CMS Implementation Guide](/04_CMS_Implementation_Guide.md) - Technical details
- [API Documentation](/docs/API.md) - API reference

## 🔗 Social Links

- **LinkedIn**: https://www.linkedin.com/in/ismail-abidemi-bethany-507064198
- **Instagram**: https://www.instagram.com/light_realtyofficial
- **YouTube**: https://youtube.com/@bethanythedesigningrealtor

---

Built with 💚 for VELD AFRICA
