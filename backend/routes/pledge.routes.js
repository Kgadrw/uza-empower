import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createPledge,
  getPledges,
  getPledgeById,
  confirmPledge,
  cancelPledge
} from '../controllers/pledge.controller.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /pledges:
 *   post:
 *     summary: Create a pledge (donor/admin only)
 *     tags: [Pledges]
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
 *               - amount
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Pledge created successfully
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
 *                     pledge:
 *                       $ref: '#/components/schemas/Pledge'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', requireRole('donor', 'admin'), createPledge);

/**
 * @swagger
 * /pledges:
 *   get:
 *     summary: Get all pledges
 *     tags: [Pledges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Pledges retrieved successfully
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
 *                     pledges:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pledge'
 *                     pagination:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', getPledges);

/**
 * @swagger
 * /pledges/{id}:
 *   get:
 *     summary: Get pledge by ID
 *     tags: [Pledges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pledge ID
 *     responses:
 *       200:
 *         description: Pledge retrieved successfully
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
 *                     pledge:
 *                       $ref: '#/components/schemas/Pledge'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getPledgeById);

/**
 * @swagger
 * /pledges/{id}/confirm:
 *   patch:
 *     summary: Confirm pledge
 *     tags: [Pledges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pledge ID
 *     responses:
 *       200:
 *         description: Pledge confirmed successfully
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
 *                     pledge:
 *                       $ref: '#/components/schemas/Pledge'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/confirm', confirmPledge);

/**
 * @swagger
 * /pledges/{id}/cancel:
 *   patch:
 *     summary: Cancel pledge (donor/admin only)
 *     tags: [Pledges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pledge ID
 *     responses:
 *       200:
 *         description: Pledge cancelled successfully
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
 *                     pledge:
 *                       $ref: '#/components/schemas/Pledge'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/cancel', cancelPledge);

export default router;
