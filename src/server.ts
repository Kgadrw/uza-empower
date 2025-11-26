import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './utils/errors';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import kycRoutes from './routes/kyc.routes';
import projectRoutes from './routes/project.routes';
import fundingRequestRoutes from './routes/fundingRequest.routes';
import pledgeRoutes from './routes/pledge.routes';
import trancheRoutes from './routes/tranche.routes';
import transactionRoutes from './routes/transaction.routes';
import milestoneRoutes from './routes/milestone.routes';
import topUpRoutes from './routes/topUp.routes';
import alertRoutes from './routes/alert.routes';
import disputeRoutes from './routes/dispute.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';
import messagingRoutes from './routes/messaging.routes';
import uploadRoutes from './routes/upload.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'UZA Empower API Documentation',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'UZA Empower API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/funding-requests', fundingRequestRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api', trancheRoutes);
app.use('/api', transactionRoutes);
app.use('/api', milestoneRoutes);
app.use('/api', topUpRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', uploadRoutes); // Alias for media access

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;

