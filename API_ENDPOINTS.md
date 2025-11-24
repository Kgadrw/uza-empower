# UZA Empower API Endpoints Reference

Complete list of all API endpoints with their methods, paths, authentication requirements, and descriptions.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and get JWT token |
| POST | `/auth/refresh` | No | Refresh access token |
| POST | `/auth/logout` | Yes | Logout (invalidate token) |

---

## 2. User Management (`/api/users`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/me` | Yes | Any | Get current user profile |
| PUT | `/users/me` | Yes | Any | Update current user profile |
| GET | `/users/:id` | Yes | Admin | Get user by ID |

---

## 3. KYC/KYB (`/api/kyc`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/kyc/submit` | Yes | Any | Submit KYC documents |
| GET | `/kyc/status` | Yes | Any | Get KYC status |
| GET | `/kyc/pending` | Yes | Admin | Get pending KYC requests |
| PUT | `/kyc/:id/approve` | Yes | Admin | Approve KYC |
| PUT | `/kyc/:id/reject` | Yes | Admin | Reject KYC |

---

## 4. Projects (`/api/projects`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/projects` | Yes | Beneficiary | Create a project |
| GET | `/projects` | No | Public | List all projects (public) |
| GET | `/projects/mine` | Yes | Beneficiary | Get my projects |
| GET | `/projects/:id` | No | Public | Get project by ID |
| PUT | `/projects/:id` | Yes | Owner/Admin | Update project |
| PUT | `/projects/:id/status` | Yes | Admin | Update project status |
| GET | `/projects/:id/budget` | No | Public | Get project budget |
| PUT | `/projects/:id/budget` | Yes | Owner/Admin | Update project budget |
| GET | `/projects/:id/kpis` | No | Public | Get project KPIs |
| GET | `/projects/:id/impact-report` | No | Public | Get impact report |
| POST | `/projects/:id/complete` | Yes | Owner/Admin | Mark project as completed |

---

## 5. Funding Requests (`/api/funding-requests`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/funding-requests` | Yes | Beneficiary | Create funding request |
| GET | `/funding-requests/mine` | Yes | Beneficiary | Get my funding requests |
| GET | `/funding-requests/pending` | Yes | Admin | Get pending funding requests |
| GET | `/funding-requests/:id` | Yes | Any | Get funding request by ID |
| PUT | `/funding-requests/:id/approve` | Yes | Admin | Approve funding request |
| PUT | `/funding-requests/:id/reject` | Yes | Admin | Reject funding request |

---

## 6. Pledges (`/api/pledges`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/pledges` | Yes | Donor | Create a pledge |
| GET | `/pledges/mine` | Yes | Donor | Get my pledges |
| GET | `/pledges/projects/:id` | No | Public | Get project pledges |
| GET | `/pledges/:id` | Yes | Any | Get pledge by ID |

---

## 7. Tranches (`/api`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/projects/:id/tranches/:trancheId/release` | Yes | Admin | Release tranche |
| POST | `/projects/:id/tranches/:trancheId/freeze` | Yes | Admin | Freeze tranche |
| GET | `/projects/:id/tranches` | Yes | Any | Get project tranches |

---

## 8. Transactions (`/api`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/projects/:id/transactions` | Yes | Owner/Admin | Create transaction |
| GET | `/projects/:id/transactions` | Yes | Any | Get project transactions |
| GET | `/transactions/:id` | Yes | Any | Get transaction by ID |
| POST | `/transactions/:id/media` | Yes | Owner/Admin | Upload transaction media |
| GET | `/projects/:id/ledger` | Yes | Any | Get project ledger |

---

## 9. Milestones (`/api`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/projects/:id/milestones` | Yes | Owner/Admin | Create milestone |
| GET | `/projects/:id/milestones` | No | Public | Get project milestones |
| POST | `/milestones/:id/evidence` | Yes | Owner/Admin | Upload milestone evidence |
| PUT | `/milestones/:id/approve` | Yes | Admin | Approve milestone |
| PUT | `/milestones/:id/reject` | Yes | Admin | Reject milestone |

---

## 10. Top-Up Requests (`/api`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/projects/:id/top-ups` | Yes | Owner/Admin | Create top-up request |
| GET | `/projects/:id/top-ups` | Yes | Any | Get project top-ups |
| PUT | `/top-ups/:id/approve` | Yes | Admin | Approve top-up |
| PUT | `/top-ups/:id/reject` | Yes | Admin | Reject top-up |

---

## 11. Alerts (`/api/alerts`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/alerts` | Yes | Admin | Get all alerts |
| GET | `/alerts/projects/:id` | Yes | Any | Get project alerts |
| PUT | `/alerts/:id/resolve` | Yes | Admin | Resolve alert |

---

## 12. Disputes (`/api/disputes`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/disputes/projects/:id/disputes` | Yes | Any | Create dispute |
| GET | `/disputes/mine` | Yes | Any | Get my disputes |
| GET | `/disputes/pending` | Yes | Admin | Get pending disputes |
| PUT | `/disputes/:id/resolve` | Yes | Admin | Resolve dispute |

---

## 13. Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/notifications` | Yes | Any | Get notifications |
| PUT | `/notifications/:id/read` | Yes | Any | Mark notification as read |

---

## 14. Admin Console (`/api/admin`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/admin/dashboard` | Yes | Admin | Get admin dashboard |
| GET | `/admin/review-queue` | Yes | Admin | Get review queue |
| GET | `/admin/risk-heatmap` | Yes | Admin | Get risk heatmap |
| GET | `/admin/audit-log` | Yes | Admin | Get audit log |

---

## 15. Payments (`/api/payments`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/payments/webhook` | No | System | Payment webhook |
| GET | `/payments/:id` | Yes | Any | Get payment by ID |
| GET | `/payments/projects/:id/payments` | Yes | Any | Get project payments |

---

## 16. Messaging (`/api/messaging`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/messaging/sms` | Yes | Admin | Send SMS |
| POST | `/messaging/whatsapp` | Yes | Admin | Send WhatsApp |
| POST | `/messaging/email` | Yes | Admin | Send email |

---

## 17. File Upload (`/api/upload`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/upload` | Yes | Any | Upload file |
| GET | `/media/:id` | No | Public | Get media file |

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

