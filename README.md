# UZA Empower Backend API

A comprehensive backend API for the UZA Empower platform, built with Node.js, Express, TypeScript, and Prisma.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Beneficiary, Donor)
- **User Management**: User profiles, KYC/KYB verification
- **Project Management**: Full CRUD operations for projects with budget tracking
- **Funding System**: Funding requests, pledges, and escrow management
- **Transaction Tracking**: Expense and revenue logging with media proof
- **Milestones**: Project milestone tracking with evidence upload
- **Risk Management**: Alert system for anomalies and risk detection
- **Dispute Resolution**: Dispute management system
- **Notifications**: In-app notification system
- **Admin Dashboard**: Comprehensive admin console with analytics
- **Payment Integration**: Webhook support for payment providers
- **File Upload**: Secure file upload and media management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uzaempower
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   - `DATABASE_URL`: MongoDB connection string (already configured for MongoDB Atlas)
   - `JWT_SECRET`: Secret key for JWT tokens
   - `JWT_REFRESH_SECRET`: Secret key for refresh tokens
   - Other configuration as needed

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Push schema to MongoDB (MongoDB doesn't use traditional migrations)
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` (or the port specified in `.env`)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID (admin only)

### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status` - Get KYC status
- `GET /api/kyc/pending` - Get pending KYC requests (admin)
- `PUT /api/kyc/:id/approve` - Approve KYC (admin)
- `PUT /api/kyc/:id/reject` - Reject KYC (admin)

### Projects
- `POST /api/projects` - Create a project
- `GET /api/projects` - List all projects (public)
- `GET /api/projects/mine` - Get my projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `PUT /api/projects/:id/status` - Update project status (admin)
- `GET /api/projects/:id/budget` - Get project budget
- `PUT /api/projects/:id/budget` - Update project budget
- `GET /api/projects/:id/kpis` - Get project KPIs
- `GET /api/projects/:id/impact-report` - Get impact report
- `POST /api/projects/:id/complete` - Mark project as completed

### Funding Requests
- `POST /api/funding-requests` - Create funding request
- `GET /api/funding-requests/mine` - Get my funding requests
- `GET /api/funding-requests/pending` - Get pending requests (admin)
- `GET /api/funding-requests/:id` - Get funding request by ID
- `PUT /api/funding-requests/:id/approve` - Approve request (admin)
- `PUT /api/funding-requests/:id/reject` - Reject request (admin)

### Pledges
- `POST /api/pledges` - Create a pledge
- `GET /api/pledges/mine` - Get my pledges
- `GET /api/pledges/projects/:id` - Get project pledges
- `GET /api/pledges/:id` - Get pledge by ID

### Tranches
- `POST /api/projects/:id/tranches/:trancheId/release` - Release tranche (admin)
- `POST /api/projects/:id/tranches/:trancheId/freeze` - Freeze tranche (admin)
- `GET /api/projects/:id/tranches` - Get project tranches

### Transactions
- `POST /api/projects/:id/transactions` - Create transaction
- `GET /api/projects/:id/transactions` - Get project transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions/:id/media` - Upload transaction media
- `GET /api/projects/:id/ledger` - Get project ledger

### Milestones
- `POST /api/projects/:id/milestones` - Create milestone
- `GET /api/projects/:id/milestones` - Get project milestones
- `POST /api/milestones/:id/evidence` - Upload milestone evidence
- `PUT /api/milestones/:id/approve` - Approve milestone (admin)
- `PUT /api/milestones/:id/reject` - Reject milestone (admin)

### Top-Up Requests
- `POST /api/projects/:id/top-ups` - Create top-up request
- `GET /api/projects/:id/top-ups` - Get project top-ups
- `PUT /api/top-ups/:id/approve` - Approve top-up (admin)
- `PUT /api/top-ups/:id/reject` - Reject top-up (admin)

### Alerts
- `GET /api/alerts` - Get all alerts (admin)
- `GET /api/alerts/projects/:id` - Get project alerts
- `PUT /api/alerts/:id/resolve` - Resolve alert (admin)

### Disputes
- `POST /api/disputes/projects/:id/disputes` - Create dispute
- `GET /api/disputes/mine` - Get my disputes
- `GET /api/disputes/pending` - Get pending disputes (admin)
- `PUT /api/disputes/:id/resolve` - Resolve dispute (admin)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/review-queue` - Get review queue
- `GET /api/admin/risk-heatmap` - Get risk heatmap
- `GET /api/admin/audit-log` - Get audit log

### Payments
- `POST /api/payments/webhook` - Payment webhook
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/projects/:id/payments` - Get project payments

### Messaging
- `POST /api/messaging/sms` - Send SMS (admin)
- `POST /api/messaging/whatsapp` - Send WhatsApp (admin)
- `POST /api/messaging/email` - Send email (admin)

### Upload
- `POST /api/upload` - Upload file
- `GET /api/media/:id` - Get media file

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## User Roles

- **ADMIN**: Full system access
- **BENEFICIARY**: Can create and manage projects
- **DONOR**: Can make pledges to projects

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

- User
- KYC
- Project
- ProjectBudget
- ProjectKPI
- FundingRequest
- Pledge
- Tranche
- Transaction
- TransactionMedia
- Milestone
- TopUpRequest
- Alert
- Dispute
- Notification
- Payment
- AuditLog

## Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma Studio (database GUI)
npm run prisma:studio
```

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

```
src/
├── config/          # Configuration files (database, upload)
├── controllers/     # Route controllers
├── middleware/      # Express middleware (auth, validation)
├── routes/          # Route definitions
├── utils/           # Utility functions (JWT, password, errors)
└── server.ts        # Main server file
```

## Deployment

### Render.com

The project includes a `render.yaml` configuration file for easy deployment on Render.com.

**Important: Render Dashboard Settings**

When setting up your service on Render, make sure to configure:

1. **Root Directory**: Set to `.` (project root) - **NOT** `src/`
   - This is critical! If Root Directory is set to `src/`, the build will fail
   - Go to your service settings → Root Directory → Set to `.` or leave empty

2. **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - This will install dependencies, generate Prisma client, and compile TypeScript

3. **Start Command**: `node dist/server.js`
   - This runs the compiled JavaScript from the dist folder

**Required Environment Variables on Render:**
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate a strong secret)
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens (generate a strong secret)
- `NODE_ENV` - Set to `production`
- `PORT` - Render automatically sets this (default: 10000)
- `UPLOAD_DIR` - Set to `./uploads`
- `MAX_FILE_SIZE` - File size limit in bytes (default: 10485760)

**Build Process:**
1. Render will automatically run: `npm install && npm run prisma:generate && npm run build`
2. Then start the server with: `node dist/server.js`

**Troubleshooting:**
- If you see `Cannot find module '/opt/render/project/src/dist/server.js'`, check that Root Directory is set to `.` (project root) in Render dashboard
- Make sure your MongoDB Atlas IP whitelist includes Render's IP addresses or allows connections from anywhere (0.0.0.0/0)
- Verify the build completes successfully by checking the build logs

### Other Platforms

For other platforms (Heroku, Railway, etc.), ensure:
1. Build command runs: `npm run build` (which includes Prisma generation)
2. Start command: `npm start`
3. All environment variables are configured
4. Prisma client is generated before the build completes

## License

ISC

