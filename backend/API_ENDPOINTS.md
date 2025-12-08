# Complete API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register
- **POST** `/auth/register`
- **Body**: `{ name, email, password, role, phone? }`
- **Response**: `{ success, data: { token, user } }`

### Login
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, data: { token, user } }`

### Refresh Token
- **POST** `/auth/refresh`
- **Body**: `{ refreshToken }`
- **Response**: `{ success, data: { token } }`

### Logout
- **POST** `/auth/logout`
- **Auth**: Required
- **Response**: `{ success, message }`

### Forgot Password
- **POST** `/auth/forgot-password`
- **Body**: `{ email }`
- **Response**: `{ success, message }`

### Reset Password
- **POST** `/auth/reset-password`
- **Body**: `{ token, newPassword }`
- **Response**: `{ success, message }`

---

## 👤 User Endpoints

### Get Current User
- **GET** `/users/me`
- **Auth**: Required
- **Response**: `{ success, data: { user } }`

### Update Profile
- **PUT** `/users/me`
- **Auth**: Required
- **Body**: `{ name?, phone?, location? }`
- **Response**: `{ success, data: { user } }`

### Get User by ID
- **GET** `/users/:id`
- **Auth**: Required
- **Response**: `{ success, data: { user } }`

### Update User
- **PUT** `/users/:id`
- **Auth**: Required (admin or self)
- **Body**: `{ name?, email?, phone?, role?, isActive? }`
- **Response**: `{ success, data: { user } }`

### Get All Users
- **GET** `/users?role=&status=&page=&limit=`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { users, pagination } }`

### Update User Role
- **PATCH** `/users/:id/role`
- **Auth**: Required (admin only)
- **Body**: `{ role }`
- **Response**: `{ success, data: { user } }`

---

## 📁 Project Endpoints

### Create Project
- **POST** `/projects`
- **Auth**: Required (beneficiary/admin)
- **Body**: `{ title, description, category, location, requestedAmount, budget? }`
- **Response**: `{ success, data: { project } }`

### Get Projects
- **GET** `/projects?status=&category=&page=&limit=&search=`
- **Auth**: Required
- **Response**: `{ success, data: { projects, pagination } }`

### Get My Projects
- **GET** `/projects/mine`
- **Auth**: Required
- **Response**: `{ success, data: { projects } }`

### Get Project by ID
- **GET** `/projects/:id`
- **Auth**: Required
- **Response**: `{ success, data: { project } }`

### Update Project
- **PUT** `/projects/:id`
- **Auth**: Required (beneficiary/admin)
- **Body**: `{ title?, description?, category?, location?, budget? }`
- **Response**: `{ success, data: { project } }`

### Delete Project
- **DELETE** `/projects/:id`
- **Auth**: Required (beneficiary/admin)
- **Response**: `{ success, message }`

### Get Project KPIs
- **GET** `/projects/:id/kpis`
- **Auth**: Required
- **Response**: `{ success, data: { totalBudget, totalDisbursed, totalSpent, totalRevenue, margin, ... } }`

### Get Project Analytics
- **GET** `/projects/:id/analytics`
- **Auth**: Required
- **Response**: `{ success, data: { monthlyData, transactions } }`

### Get Project Transactions
- **GET** `/projects/:id/transactions`
- **Auth**: Required
- **Response**: `{ success, data: { transactions } }`

### Get Project Milestones
- **GET** `/projects/:id/milestones`
- **Auth**: Required
- **Response**: `{ success, data: { milestones } }`

### Approve Project
- **PATCH** `/projects/:id/approve`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { project } }`

### Reject Project
- **PATCH** `/projects/:id/reject`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { project } }`

---

## 💰 Funding Request Endpoints

### Create Funding Request
- **POST** `/funding-requests`
- **Auth**: Required
- **Body**: `{ projectId, requestedAmount, purpose, budgetBreakdown? }`
- **Response**: `{ success, data: { fundingRequest } }`

### Get Funding Requests
- **GET** `/funding-requests?status=&page=&limit=`
- **Auth**: Required
- **Response**: `{ success, data: { fundingRequests, pagination } }`

### Get Funding Request by ID
- **GET** `/funding-requests/:id`
- **Auth**: Required
- **Response**: `{ success, data: { fundingRequest } }`

### Approve Funding Request
- **PATCH** `/funding-requests/:id/approve`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { fundingRequest } }`

### Reject Funding Request
- **PATCH** `/funding-requests/:id/reject`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { fundingRequest } }`

---

## 🎯 Milestone Endpoints

### Create Milestone
- **POST** `/milestones`
- **Auth**: Required
- **Body**: `{ projectId, title, description?, targetDate?, trancheAmount? }`
- **Response**: `{ success, data: { milestone } }`

### Get Milestones
- **GET** `/milestones?projectId=&status=`
- **Auth**: Required
- **Response**: `{ success, data: { milestones } }`

### Get Milestone by ID
- **GET** `/milestones/:id`
- **Auth**: Required
- **Response**: `{ success, data: { milestone } }`

### Submit Milestone Evidence
- **POST** `/milestones/:id/evidence`
- **Auth**: Required
- **Body**: `{ evidence: [{ url }] }`
- **Response**: `{ success, data: { milestone } }`

### Approve Milestone
- **PATCH** `/milestones/:id/approve`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { milestone } }`

### Reject Milestone
- **PATCH** `/milestones/:id/reject`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { milestone } }`

---

## 💳 Transaction Endpoints

### Create Transaction
- **POST** `/transactions`
- **Auth**: Required
- **Body**: `{ projectId, type, category, amount, description?, date?, proofUrl? }`
- **Response**: `{ success, data: { transaction } }`

### Get Transactions
- **GET** `/transactions?projectId=&type=&category=&page=&limit=`
- **Auth**: Required
- **Response**: `{ success, data: { transactions, pagination } }`

### Get Transaction by ID
- **GET** `/transactions/:id`
- **Auth**: Required
- **Response**: `{ success, data: { transaction } }`

### Update Transaction
- **PUT** `/transactions/:id`
- **Auth**: Required (creator/admin)
- **Body**: `{ category?, description?, proofUrl? }`
- **Response**: `{ success, data: { transaction } }`

### Delete Transaction
- **DELETE** `/transactions/:id`
- **Auth**: Required (admin only)
- **Response**: `{ success, message }`

---

## 🤝 Pledge Endpoints

### Create Pledge
- **POST** `/pledges`
- **Auth**: Required (donor/admin)
- **Body**: `{ projectId, amount }`
- **Response**: `{ success, data: { pledge } }`

### Get Pledges
- **GET** `/pledges?projectId=&status=&page=&limit=`
- **Auth**: Required
- **Response**: `{ success, data: { pledges, pagination } }`

### Get Pledge by ID
- **GET** `/pledges/:id`
- **Auth**: Required
- **Response**: `{ success, data: { pledge } }`

### Confirm Pledge
- **PATCH** `/pledges/:id/confirm`
- **Auth**: Required
- **Response**: `{ success, data: { pledge } }`

### Cancel Pledge
- **PATCH** `/pledges/:id/cancel`
- **Auth**: Required (donor/admin)
- **Response**: `{ success, data: { pledge } }`

---

## 🚨 Alert Endpoints

### Get Alerts
- **GET** `/alerts?projectId=&type=&severity=&status=&page=&limit=`
- **Auth**: Required
- **Response**: `{ success, data: { alerts, pagination } }`

### Get Alert by ID
- **GET** `/alerts/:id`
- **Auth**: Required
- **Response**: `{ success, data: { alert } }`

### Create Alert
- **POST** `/alerts`
- **Auth**: Required (admin only)
- **Body**: `{ projectId?, type, severity?, description }`
- **Response**: `{ success, data: { alert } }`

### Resolve Alert
- **PATCH** `/alerts/:id/resolve`
- **Auth**: Required
- **Response**: `{ success, data: { alert } }`

### Mark Alert as Read
- **PATCH** `/alerts/:id/read`
- **Auth**: Required
- **Response**: `{ success, data: { alert } }`

---

## 🔔 Notification Endpoints

### Get Notifications
- **GET** `/notifications?read=&page=&limit=`
- **Auth**: Required
- **Response**: `{ success, data: { notifications, unreadCount, pagination } }`

### Get Notification by ID
- **GET** `/notifications/:id`
- **Auth**: Required
- **Response**: `{ success, data: { notification } }`

### Mark as Read
- **PATCH** `/notifications/:id/read`
- **Auth**: Required
- **Response**: `{ success, data: { notification } }`

### Mark All as Read
- **PATCH** `/notifications/read-all`
- **Auth**: Required
- **Response**: `{ success, message }`

### Delete Notification
- **DELETE** `/notifications/:id`
- **Auth**: Required
- **Response**: `{ success, message }`

---

## ✅ KYC Endpoints

### Submit KYC
- **POST** `/kyc/submit`
- **Auth**: Required
- **Body**: `{ documents?, businessName?, location?, phone? }`
- **Response**: `{ success, data: { user } }`

### Get KYC Status
- **GET** `/kyc/status/:id?`
- **Auth**: Required
- **Response**: `{ success, data: { kycStatus, businessName, location, phone } }`

### Get Pending KYC
- **GET** `/kyc/pending?page=&limit=`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { users, pagination } }`

### Approve KYC
- **PATCH** `/kyc/:id/approve`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { user } }`

### Reject KYC
- **PATCH** `/kyc/:id/reject`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { user } }`

---

## 📊 Dashboard Endpoints

### Admin Dashboard
- **GET** `/dashboards/admin`
- **Auth**: Required (admin only)
- **Response**: `{ success, data: { summary, recentProjects, recentAlerts } }`

### Donor Dashboard
- **GET** `/dashboards/donor`
- **Auth**: Required (donor/admin)
- **Response**: `{ success, data: { portfolioSummary, projects } }`

### Beneficiary Dashboard
- **GET** `/dashboards/beneficiary`
- **Auth**: Required (beneficiary/admin)
- **Response**: `{ success, data: { summary, projectData, unreadNotifications } }`

---

## 📎 Media Endpoints

### Upload File
- **POST** `/media/upload`
- **Auth**: Required
- **Body**: FormData with `file` field
- **Response**: `{ success, data: { url, filename, size, mimetype } }`

### Upload Multiple Files
- **POST** `/media/upload-multiple`
- **Auth**: Required
- **Body**: FormData with `files` field (array)
- **Response**: `{ success, data: { files } }`

### Get File
- **GET** `/media/:id`
- **Auth**: Required
- **Response**: File stream

### Delete File
- **DELETE** `/media/:id`
- **Auth**: Required
- **Response**: `{ success, message }`

---

## 💳 Payment Endpoints

### Create Payment
- **POST** `/payments`
- **Auth**: Required
- **Body**: `{ amount, projectId?, pledgeId? }`
- **Response**: `{ success, data: { payment } }`

### Get Payment
- **GET** `/payments/:id`
- **Auth**: Required
- **Response**: `{ success, data: { payment } }`

### Payment Webhook
- **POST** `/payments/webhook`
- **Auth**: None (public endpoint)
- **Body**: Payment gateway webhook payload
- **Response**: `{ success }`

---

## ⚖️ Dispute Endpoints

### Create Dispute
- **POST** `/disputes`
- **Auth**: Required
- **Body**: `{ projectId, type, description, evidence? }`
- **Response**: `{ success, data: { dispute } }`

### Get Disputes
- **GET** `/disputes`
- **Auth**: Required
- **Response**: `{ success, data: { disputes } }`

### Resolve Dispute
- **PATCH** `/disputes/:id/resolve`
- **Auth**: Required (admin only)
- **Body**: `{ resolution, notes? }`
- **Response**: `{ success, message }`

---

## 🏥 Health Check

### Health Check
- **GET** `/health`
- **Auth**: None
- **Response**: `{ status: 'ok', message, timestamp, uptime }`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

