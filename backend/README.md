# UZA Empower Backend API

Complete backend API for UZA Empower platform with all endpoints for Admin, Donor, and Beneficiary dashboards.

## Features

- ✅ Complete authentication system (register, login, refresh, logout)
- ✅ User management with role-based access control
- ✅ Project management (CRUD, KPIs, analytics)
- ✅ Funding request system
- ✅ Milestone tracking and approval
- ✅ Transaction recording and management
- ✅ Pledge system for donors
- ✅ Alert and notification system
- ✅ KYC verification workflow
- ✅ Dashboard endpoints for all user roles
- ✅ File upload and media management
- ✅ Payment integration (placeholder)
- ✅ Dispute resolution system

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **CORS** enabled for frontend integration

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (MongoDB URI, JWT secrets, etc.)

3. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (admin/self)
- `GET /api/users` - Get all users (admin only)
- `PATCH /api/users/:id/role` - Update user role (admin only)

### Projects
- `POST /api/projects` - Create project (beneficiary/admin)
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/mine` - Get my projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/kpis` - Get project KPIs
- `GET /api/projects/:id/analytics` - Get project analytics
- `GET /api/projects/:id/transactions` - Get project transactions
- `GET /api/projects/:id/milestones` - Get project milestones
- `PATCH /api/projects/:id/approve` - Approve project (admin)
- `PATCH /api/projects/:id/reject` - Reject project (admin)

### Funding Requests
- `POST /api/funding-requests` - Create funding request
- `GET /api/funding-requests` - Get funding requests
- `GET /api/funding-requests/:id` - Get funding request by ID
- `PATCH /api/funding-requests/:id/approve` - Approve request (admin)
- `PATCH /api/funding-requests/:id/reject` - Reject request (admin)

### Milestones
- `POST /api/milestones` - Create milestone
- `GET /api/milestones` - Get milestones (with filters)
- `GET /api/milestones/:id` - Get milestone by ID
- `POST /api/milestones/:id/evidence` - Submit milestone evidence
- `PATCH /api/milestones/:id/approve` - Approve milestone (admin)
- `PATCH /api/milestones/:id/reject` - Reject milestone (admin)

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get transactions (with filters)
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction (admin)

### Pledges
- `POST /api/pledges` - Create pledge (donor)
- `GET /api/pledges` - Get pledges
- `GET /api/pledges/:id` - Get pledge by ID
- `PATCH /api/pledges/:id/confirm` - Confirm pledge
- `PATCH /api/pledges/:id/cancel` - Cancel pledge

### Alerts
- `GET /api/alerts` - Get alerts
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create alert (admin)
- `PATCH /api/alerts/:id/resolve` - Resolve alert
- `PATCH /api/alerts/:id/read` - Mark alert as read

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/:id` - Get notification by ID
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status/:id?` - Get KYC status
- `GET /api/kyc/pending` - Get pending KYC (admin)
- `PATCH /api/kyc/:id/approve` - Approve KYC (admin)
- `PATCH /api/kyc/:id/reject` - Reject KYC (admin)

### Dashboards
- `GET /api/dashboards/admin` - Admin dashboard data
- `GET /api/dashboards/donor` - Donor dashboard data
- `GET /api/dashboards/beneficiary` - Beneficiary dashboard data

### Media
- `POST /api/media/upload` - Upload single file
- `POST /api/media/upload-multiple` - Upload multiple files
- `GET /api/media/:id` - Get file
- `DELETE /api/media/:id` - Delete file

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment
- `POST /api/payments/webhook` - Payment webhook (public)

### Disputes
- `POST /api/disputes` - Create dispute
- `GET /api/disputes` - Get disputes
- `PATCH /api/disputes/:id/resolve` - Resolve dispute (admin)

### Health Check
- `GET /api/health` - Health check endpoint

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Donor**: Access to donor-specific endpoints and pledged projects
- **Beneficiary**: Access to beneficiary-specific endpoints and own projects

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Models

- User
- Project
- FundingRequest
- Milestone
- Transaction
- Pledge
- Alert
- Notification

## File Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Request handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── project.controller.js
│   ├── fundingRequest.controller.js
│   ├── milestone.controller.js
│   ├── transaction.controller.js
│   ├── pledge.controller.js
│   ├── alert.controller.js
│   ├── notification.controller.js
│   ├── kyc.controller.js
│   ├── dashboard.controller.js
│   ├── media.controller.js
│   ├── payment.controller.js
│   └── dispute.controller.js
├── middleware/
│   └── auth.middleware.js   # Authentication & authorization
├── models/                  # Mongoose models
│   ├── User.js
│   ├── Project.js
│   ├── FundingRequest.js
│   ├── Milestone.js
│   ├── Transaction.js
│   ├── Pledge.js
│   ├── Alert.js
│   └── Notification.js
├── routes/                  # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── project.routes.js
│   ├── fundingRequest.routes.js
│   ├── milestone.routes.js
│   ├── transaction.routes.js
│   ├── pledge.routes.js
│   ├── alert.routes.js
│   ├── notification.routes.js
│   ├── kyc.routes.js
│   ├── dashboard.routes.js
│   ├── media.routes.js
│   ├── payment.routes.js
│   └── dispute.routes.js
├── uploads/                 # Uploaded files directory
├── .env.example             # Environment variables template
├── package.json
├── server.js                # Main server file
└── README.md
```

## Development

### Running in Development Mode

```bash
npm run dev
```

Uses nodemon for auto-reload on file changes.

### Environment Variables

Make sure to set up all required environment variables in `.env`:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `DEPLOYED_URL` or `PRODUCTION_URL` - Deployed API URL for Swagger documentation (e.g., `https://api.uzaempower.com/api`)
- `API_URL` or `BACKEND_URL` - Alternative API URL configuration

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Set `DEPLOYED_URL` or `PRODUCTION_URL` to your deployed API URL (e.g., `https://api.uzaempower.com/api`) for Swagger documentation
5. Set up file storage (consider cloud storage like AWS S3)
6. Enable HTTPS
7. Set up proper logging and monitoring
8. Configure rate limiting
9. Set up database backups

## API Documentation

The API documentation is available via Swagger UI at:
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://your-deployed-url.com/api-docs`

The Swagger documentation automatically uses the deployed URL when `DEPLOYED_URL` or `PRODUCTION_URL` environment variable is set. In development, it defaults to localhost.

## Notes

- File uploads are stored locally in the `uploads/` directory. For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- Payment integration is a placeholder - implement actual payment gateway integration for production
- Email/SMS notifications are placeholders - integrate with actual services for production
- Dispute resolution is a placeholder - implement full workflow based on your requirements

## License

MIT
