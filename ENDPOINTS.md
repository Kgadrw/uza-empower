# UZA Empower API - Complete Endpoints List

## System Endpoints

### Health Check
- `GET /health` - Health check endpoint (no auth required)

### Documentation
- `GET /api-docs` - Swagger API documentation (no auth required)

---

## Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user (no auth required)
- `POST /api/auth/login` - Login user (no auth required)
- `POST /api/auth/refresh` - Refresh access token (no auth required)
- `POST /api/auth/logout` - Logout user (requires authentication)

---

## Users (`/api/users`)

- `GET /api/users/me` - Get current user profile (requires authentication)
- `PUT /api/users/me` - Update current user profile (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication + ADMIN role)

---

## KYC (`/api/kyc`)

- `POST /api/kyc/submit` - Submit KYC documents (requires authentication, file upload)
- `GET /api/kyc/status` - Get KYC status for current user (requires authentication)
- `GET /api/kyc/pending` - Get pending KYC submissions (requires authentication + ADMIN role)
- `PUT /api/kyc/:id/approve` - Approve KYC submission (requires authentication + ADMIN role)
- `PUT /api/kyc/:id/reject` - Reject KYC submission (requires authentication + ADMIN role)

---

## Projects (`/api/projects`)

- `POST /api/projects` - Create a new project (requires authentication)
- `GET /api/projects` - Get all projects (no auth required)
- `GET /api/projects/mine` - Get current user's projects (requires authentication)
- `GET /api/projects/:id` - Get project by ID (no auth required)
- `PUT /api/projects/:id` - Update project (requires authentication)
- `PUT /api/projects/:id/status` - Update project status (requires authentication + ADMIN role)
- `GET /api/projects/:id/budget` - Get project budget (no auth required)
- `PUT /api/projects/:id/budget` - Update project budget (requires authentication)
- `GET /api/projects/:id/kpis` - Get project KPIs (no auth required)
- `GET /api/projects/:id/impact-report` - Get project impact report (no auth required)
- `POST /api/projects/:id/complete` - Complete a project (requires authentication)

---

## Funding Requests (`/api/funding-requests`)

- `POST /api/funding-requests` - Create a funding request (requires authentication)
- `GET /api/funding-requests/mine` - Get current user's funding requests (requires authentication)
- `GET /api/funding-requests/pending` - Get pending funding requests (requires authentication + ADMIN role)
- `GET /api/funding-requests/:id` - Get funding request by ID (requires authentication)
- `PUT /api/funding-requests/:id/approve` - Approve funding request (requires authentication + ADMIN role)
- `PUT /api/funding-requests/:id/reject` - Reject funding request (requires authentication + ADMIN role)

---

## Pledges (`/api/pledges`)

- `POST /api/pledges` - Create a pledge (requires authentication)
- `GET /api/pledges/mine` - Get current user's pledges (requires authentication)
- `GET /api/pledges/projects/:id` - Get pledges for a project (no auth required)
- `GET /api/pledges/:id` - Get pledge by ID (requires authentication)

---

## Tranches (`/api`)

- `POST /api/projects/:id/tranches/:trancheId/release` - Release a tranche (requires authentication + ADMIN role)
- `POST /api/projects/:id/tranches/:trancheId/freeze` - Freeze a tranche (requires authentication + ADMIN role)
- `GET /api/projects/:id/tranches` - Get project tranches (requires authentication)

---

## Transactions (`/api`)

- `POST /api/projects/:id/transactions` - Create a transaction (requires authentication)
- `GET /api/projects/:id/transactions` - Get project transactions (requires authentication)
- `GET /api/transactions/:id` - Get transaction by ID (requires authentication)
- `POST /api/transactions/:id/media` - Upload transaction media (requires authentication, file upload - multiple files)
- `GET /api/projects/:id/ledger` - Get project ledger (requires authentication)

---

## Milestones (`/api`)

- `POST /api/projects/:id/milestones` - Create a milestone (requires authentication)
- `GET /api/projects/:id/milestones` - Get project milestones (no auth required)
- `POST /api/milestones/:id/evidence` - Upload milestone evidence (requires authentication, file upload)
- `PUT /api/milestones/:id/approve` - Approve milestone (requires authentication + ADMIN role)
- `PUT /api/milestones/:id/reject` - Reject milestone (requires authentication + ADMIN role)

---

## Top-Ups (`/api`)

- `POST /api/projects/:id/top-ups` - Create a top-up request (requires authentication)
- `GET /api/projects/:id/top-ups` - Get project top-ups (requires authentication)
- `PUT /api/top-ups/:id/approve` - Approve top-up (requires authentication + ADMIN role)
- `PUT /api/top-ups/:id/reject` - Reject top-up (requires authentication + ADMIN role)

---

## Payments (`/api/payments`)

- `POST /api/payments/webhook` - Payment webhook handler (no auth required)
- `GET /api/payments/:id` - Get payment by ID (requires authentication)
- `GET /api/payments/projects/:id/payments` - Get project payments (requires authentication)

---

## Disputes (`/api/disputes`)

- `POST /api/disputes/projects/:id/disputes` - Create a dispute (requires authentication)
- `GET /api/disputes/mine` - Get current user's disputes (requires authentication)
- `GET /api/disputes/pending` - Get pending disputes (requires authentication + ADMIN role)
- `PUT /api/disputes/:id/resolve` - Resolve a dispute (requires authentication + ADMIN role)

---

## Alerts (`/api/alerts`)

- `GET /api/alerts` - Get all alerts (requires authentication + ADMIN role)
- `GET /api/alerts/projects/:id/alerts` - Get project alerts (requires authentication)
- `PUT /api/alerts/:id/resolve` - Resolve an alert (requires authentication + ADMIN role)

---

## Notifications (`/api/notifications`)

- `GET /api/notifications` - Get user notifications (requires authentication)
- `PUT /api/notifications/:id/read` - Mark notification as read (requires authentication)

---

## Messaging (`/api/messaging`)

- `POST /api/messaging/sms` - Send SMS message (requires authentication + ADMIN role)
- `POST /api/messaging/whatsapp` - Send WhatsApp message (requires authentication + ADMIN role)
- `POST /api/messaging/email` - Send email message (requires authentication + ADMIN role)

---

## File Upload (`/api/upload`)

- `POST /api/upload` - Upload a file (requires authentication, file upload)
- `GET /api/upload/:id` - Get uploaded media by ID (no auth required)

---

## Media Access (`/api/media`)

- `GET /api/media/:id` - Get media by ID (no auth required) - Alias for `/api/upload/:id`

---

## Admin (`/api/admin`)

- `GET /api/admin/dashboard` - Get admin dashboard data (requires authentication + ADMIN role)
- `GET /api/admin/review-queue` - Get review queue (requires authentication + ADMIN role)
- `GET /api/admin/risk-heatmap` - Get risk heatmap (requires authentication + ADMIN role)
- `GET /api/admin/audit-log` - Get audit log (requires authentication + ADMIN role)

---

## Summary

**Total Endpoints: 70+**

### By Authentication Level:
- **Public (no auth):** 7 endpoints
- **Authenticated:** 40+ endpoints
- **Admin only:** 20+ endpoints

### By Category:
- Authentication: 4 endpoints
- Users: 3 endpoints
- KYC: 5 endpoints
- Projects: 11 endpoints
- Funding Requests: 5 endpoints
- Pledges: 4 endpoints
- Tranches: 3 endpoints
- Transactions: 5 endpoints
- Milestones: 5 endpoints
- Top-Ups: 4 endpoints
- Payments: 3 endpoints
- Disputes: 4 endpoints
- Alerts: 3 endpoints
- Notifications: 2 endpoints
- Messaging: 3 endpoints
- File Upload: 2 endpoints
- Admin: 4 endpoints

---

## Notes

- All endpoints use JSON for request/response bodies unless specified otherwise
- File upload endpoints accept multipart/form-data
- Admin role endpoints require both authentication and ADMIN authorization
- Some endpoints have validation middleware applied (indicated by `validate()` in route definitions)

