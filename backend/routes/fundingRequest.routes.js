import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createFundingRequest,
  getFundingRequests,
  getFundingRequestById,
  approveFundingRequest,
  rejectFundingRequest
} from '../controllers/fundingRequest.controller.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /funding-requests:
 *   post:
 *     summary: Create a funding request
 *     tags: [Funding Requests]
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
 *               - requestedAmount
 *               - purpose
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               requestedAmount:
 *                 type: number
 *                 example: 10000
 *               purpose:
 *                 type: string
 *                 example: Purchase materials for construction
 *               budgetBreakdown:
 *                 type: object
 *                 description: Optional budget breakdown
 *     responses:
 *       201:
 *         description: Funding request created successfully
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
 *                     fundingRequest:
 *                       $ref: '#/components/schemas/FundingRequest'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', createFundingRequest);

/**
 * @swagger
 * /funding-requests:
 *   get:
 *     summary: Get all funding requests
 *     tags: [Funding Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
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
 *         description: Funding requests retrieved successfully
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
 *                     fundingRequests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FundingRequest'
 *                     pagination:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', getFundingRequests);

/**
 * @swagger
 * /funding-requests/{id}:
 *   get:
 *     summary: Get funding request by ID
 *     tags: [Funding Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funding request ID
 *     responses:
 *       200:
 *         description: Funding request retrieved successfully
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
 *                     fundingRequest:
 *                       $ref: '#/components/schemas/FundingRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getFundingRequestById);

/**
 * @swagger
 * /funding-requests/{id}/approve:
 *   patch:
 *     summary: Approve funding request (admin only)
 *     tags: [Funding Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funding request ID
 *     responses:
 *       200:
 *         description: Funding request approved successfully
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
 *                     fundingRequest:
 *                       $ref: '#/components/schemas/FundingRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/approve', requireRole('admin'), approveFundingRequest);

/**
 * @swagger
 * /funding-requests/{id}/reject:
 *   patch:
 *     summary: Reject funding request (admin only)
 *     tags: [Funding Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Funding request ID
 *     responses:
 *       200:
 *         description: Funding request rejected successfully
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
 *                     fundingRequest:
 *                       $ref: '#/components/schemas/FundingRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/reject', requireRole('admin'), rejectFundingRequest);

export default router;
