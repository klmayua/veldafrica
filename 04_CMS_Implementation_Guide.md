# VELD AFRICA CMS Implementation Guide

## Overview

This document describes the comprehensive CMS system implemented for VELD AFRICA, including:

1. **Role-Based Access Control (RBAC)**
2. **Project Management**
3. **Property Listings**
4. **Newsletter System**
5. **Subscription Management**
6. **Chatbot Integration**

---

## System Architecture

### Technology Stack

| Component | Technology |
|-----------|------------|
| Database | PostgreSQL + Prisma ORM |
| Authentication | NextAuth.js v5 |
| Email Service | Resend API |
| Rich Text Editor | TipTap (configured) |
| File Storage | Supabase Storage |

### Database Schema

#### Users Table
- `id` - UUID
- `email` - Unique identifier
- `password` - Hashed (bcrypt)
- `name` - Display name
- `role` - SUPER_ADMIN, ADMIN, EDITOR, VIEWER
- `status` - ACTIVE, INACTIVE, PENDING, SUSPENDED
- `lastLoginAt` - Timestamp

#### Projects Table
- Property development projects
- Status: DRAFT, ACTIVE, SOLD_OUT, COMING_SOON, ARCHIVED
- Price ranges and unit counts
- Location data

#### Properties Table
- Individual listings within projects
- Type: RESIDENTIAL, COMMERCIAL, AGRO, OFF_PLAN, LAND_BANKING
- Images, floor plans, documents
- Availability status

#### Newsletters Table
- Draft/Published workflow
- Segmentation support
- Send tracking (opens, clicks)
- HTML content storage

#### Subscribers Table
- Email subscription management
- Double opt-in confirmation
- Segment assignment
- Engagement tracking

---

## RBAC System

### Role Hierarchy

```
SUPER_ADMIN (Level 4)
├── Full system access
├── User management
├── Settings configuration
└── All project access

ADMIN (Level 3)
├── Project CRUD
├── Newsletter send
├── User management (non-admin)
└── Analytics view

EDITOR (Level 2)
├── Property CRUD
├── Newsletter create/edit
├── Project update (assigned)
└── Cannot delete or publish

VIEWER (Level 1)
├── View assigned projects
├── View properties
└── Read-only access
```

### Permission Matrix

| Action | SUPER_ADMIN | ADMIN | EDITOR | VIEWER |
|--------|-------------|-------|--------|--------|
| Create Project | ✅ | ✅ | ❌ | ❌ |
| Edit Project | ✅ | ✅ | ✅* | ❌ |
| Delete Project | ✅ | ✅ | ❌ | ❌ |
| Create Property | ✅ | ✅ | ✅ | ❌ |
| Edit Property | ✅ | ✅ | ✅ | ❌ |
| Delete Property | ✅ | ✅ | ❌ | ❌ |
| Create Newsletter | ✅ | ✅ | ✅ | ❌ |
| Publish Newsletter | ✅ | ✅ | ❌ | ❌ |
| Send Newsletter | ✅ | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ❌ | ❌ |

*Only for assigned projects

---

## API Routes

### Projects

```
GET    /api/admin/projects              - List all projects
POST   /api/admin/projects              - Create new project
GET    /api/admin/projects/[id]         - Get project details
PUT    /api/admin/projects/[id]         - Update project
DELETE /api/admin/projects/[id]         - Delete project
```

### Properties

```
GET    /api/admin/properties            - List properties
POST   /api/admin/properties            - Create property
PUT    /api/admin/properties/[id]       - Update property
DELETE /api/admin/properties/[id]       - Delete property
```

### Newsletters

```
GET    /api/admin/newsletters           - List newsletters
POST   /api/admin/newsletters           - Create newsletter
POST   /api/admin/newsletters/[id]/publish  - Publish/schedule
POST   /api/admin/newsletters/[id]/send     - Send to subscribers
```

### Subscriptions

```
POST   /api/subscribe                   - New subscription
GET    /api/subscribe/confirm           - Confirm email
GET    /api/unsubscribe                 - Unsubscribe
```

### Chat

```
POST   /api/chat                        - Send message
GET    /api/chat/[sessionId]            - Get chat history
```

---

## Newsletter Workflow

### Draft to Publication

1. **Create Draft**
   - Editor creates newsletter
   - Status: DRAFT
   - Auto-saved content

2. **Review**
   - Preview functionality
   - Test send to admins
   - Approval process

3. **Schedule/Publish**
   - Set publication date
   - Status changes to SCHEDULED or PUBLISHED

4. **Send**
   - Admins can trigger send
   - Batched processing (100 emails/batch)
   - Tracking pixel included

5. **Analytics**
   - Open rates tracked
   - Click tracking
   - Unsubscribe handling

---

## Chatbot Features

### Intent Detection

The chatbot recognizes these intents:

- **Greeting** - Welcome message
- **Property Inquiry** - Property listings
- **Pricing** - Price ranges and budgets
- **Agro Investment** - Farm estates
- **Diaspora** - International investors
- **Contact** - Schedule meetings
- **Documentation** - Legal questions
- **Payment** - Payment plans

### Lead Capture

The chatbot can capture:
- Name
- Email
- Phone
- Session history
- Page context
- Intent classification

### Integration Points

- Property database (recommend based on inquiry)
- Newsletter signup
- Contact form routing
- FAQ responses

---

## Setup Instructions

### 1. Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/veld_africa"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxx"
FROM_EMAIL="hello@veldafrica.com"

# Optional: Supabase for file storage
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 3. Running Development Server

```bash
npm run dev
```

### 4. Access Admin Panel

```
http://localhost:3000/admin/login

Demo Credentials:
- admin@veldafrica.com / password (Super Admin)
- editor@veldafrica.com / password (Editor)
- viewer@veldafrica.com / password (Viewer)
```

---

## Security Considerations

### Authentication
- Passwords hashed with bcrypt (12 rounds)
- Session-based auth with JWT
- Secure cookie settings
- CSRF protection

### Authorization
- Middleware route protection
- Role-based API guards
- Project-level permissions
- Audit logging

### Data Protection
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (React escaping)
- Rate limiting (configure in production)

---

## Production Deployment

### Environment Checklist

- [ ] Database migrated
- [ ] Environment variables set
- [ ] Email service configured
- [ ] File storage configured
- [ ] SSL certificate installed
- [ ] Rate limiting enabled
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)

### Build Command

```bash
npm run build
```

### Database Migration (Production)

```bash
npx prisma migrate deploy
```

---

## Customization

### Adding New Property Types

1. Update `PropertyType` enum in `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update frontend filters

### Adding New Newsletter Segments

1. Update subscriber segmentation logic
2. Modify newsletter create/edit UI
3. Update send API to filter by segments

### Extending Chatbot

1. Add new intent patterns in `generateBotResponse()`
2. Create action handlers
3. Add UI for quick replies

---

## Troubleshooting

### Common Issues

**Login not working**
- Check NEXTAUTH_SECRET is set
- Verify user exists in database
- Check password hash

**Emails not sending**
- Verify RESEND_API_KEY
- Check FROM_EMAIL domain verification
- Review email logs in database

**Project access denied**
- Check user role
- Verify ProjectUser association exists
- Review middleware logs

---

## Support

For technical support, contact:
- Email: dev@veldafrica.com
- Documentation: /docs (internal)
- Issues: GitHub Issues

---

*Last Updated: 2026-03-21*
*Version: 1.0.0*
