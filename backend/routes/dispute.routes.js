import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createDispute,
  getDisputes,
  resolveDispute
} from '../controllers/dispute.controller.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /disputes:
 *   post:
 *     summary: Create a dispute
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - type
 *               - description
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               type:
 *                 type: string
 *                 example: budget_discrepancy
 *               description:
 *                 type: string
 *                 example: Budget allocation does not match actual expenses
 *               evidence:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of evidence URLs
 *     responses:
 *       201:
 *         description: Dispute created successfully
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
 *                     dispute:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         projectId:
 *                           type: string
 *                         type:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [open, resolved, closed]
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', createDispute);

/**
 * @swagger
 * /disputes:
 *   get:
 *     summary: Get all disputes
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disputes retrieved successfully
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
 *                     disputes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           projectId:
 *                             type: string
 *                           type:
 *                             type: string
 *                           status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', getDisputes);

/**
 * @swagger
 * /disputes/{id}/resolve:
 *   patch:
 *     summary: Resolve dispute (admin only)
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dispute ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolution
 *             properties:
 *               resolution:
 *                 type: string
 *                 example: Dispute resolved in favor of beneficiary
 *               notes:
 *                 type: string
 *                 example: Additional notes about the resolution
 *     responses:
 *       200:
 *         description: Dispute resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dispute resolved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/resolve', requireRole('admin'), resolveDispute);

export default router;
