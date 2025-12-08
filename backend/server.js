import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import fundingRequestRoutes from './routes/fundingRequest.routes.js';
import milestoneRoutes from './routes/milestone.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import pledgeRoutes from './routes/pledge.routes.js';
import alertRoutes from './routes/alert.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import kycRoutes from './routes/kyc.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import mediaRoutes from './routes/media.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import disputeRoutes from './routes/dispute.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'UZA Empower API Documentation'
}));

// Connect to database
connectDB();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check if the API is running and healthy
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: UZA Empower Backend API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'UZA Empower Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/funding-requests', fundingRequestRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/disputes', disputeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 UZA Empower Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});
