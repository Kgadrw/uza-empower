import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  getAdminDashboard,
  getDonorDashboard,
  getBeneficiaryDashboard
} from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /dashboards/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalProjects:
 *                           type: integer
 *                         totalUsers:
 *                           type: integer
 *                         totalFunding:
 *                           type: number
 *                         pendingApprovals:
 *                           type: integer
 *                     recentProjects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *                     recentAlerts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Alert'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/admin', requireRole('admin'), getAdminDashboard);

/**
 * @swagger
 * /dashboards/donor:
 *   get:
 *     summary: Get donor dashboard data
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donor dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     portfolioSummary:
 *                       type: object
 *                       properties:
 *                         totalPledged:
 *                           type: number
 *                         totalContributed:
 *                           type: number
 *                         activeProjects:
 *                           type: integer
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/donor', requireRole('donor', 'admin'), getDonorDashboard);

/**
 * @swagger
 * /dashboards/beneficiary:
 *   get:
 *     summary: Get beneficiary dashboard data
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Beneficiary dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalProjects:
 *                           type: integer
 *                         totalFunding:
 *                           type: number
 *                         activeProjects:
 *                           type: integer
 *                     projectData:
 *                       type: array
 *                     unreadNotifications:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/beneficiary', requireRole('beneficiary', 'admin'), getBeneficiaryDashboard);

export default router;
