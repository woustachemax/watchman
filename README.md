# 🔍 Watchman Uptime Monitor

A comprehensive monitoring solution for tracking website uptime, performance, and status with real-time alerts.

## User Interface ✨

![alt text](<Screenshot from 2025-05-14 19-17-16.png>)
![alt text](<Screenshot from 2025-05-14 19-17-36.png>)
![alt text](<Screenshot from 2025-05-14 19-18-30.png>)
## ✨ Features

- **Real-time Website Monitoring**: Track your websites' availability with up-to-the-minute status checks
- **Performance Analytics**: Monitor response times, page load speeds, and other critical metrics
- **Uptime History**: View historical uptime data with detailed reports and visualizations
- **Intelligent Alerts**: Receive notifications via email, SMS, or webhooks when your sites experience issues
- **Customizable Dashboards**: Create personalized views to monitor what matters most to you
- **Team Collaboration**: Share monitoring responsibilities with team members

## 🛠️ Tech Stack

### Frontend
- **[Next.js](https://nextjs.org/)** - React framework for server-side rendering
- **[TypeScript](https://www.typescriptlang.org/)** - Strongly typed JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Clerk](https://clerk.dev/)** - Authentication and user management

### Backend
- **[Express.js](https://expressjs.com/)** - Fast, unopinionated web framework for Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Advanced open-source relational database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM for Node.js and TypeScript

### Build Tools
- **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime & toolkit
- **[Turborepo](https://turbo.build/)** - High-performance build system for JavaScript/TypeScript monorepos

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime (or Node.js v16+)
- PostgreSQL database
- [Clerk](https://clerk.dev/) account for authentication

### Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/watchman"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Backend
PORT=8080
```
