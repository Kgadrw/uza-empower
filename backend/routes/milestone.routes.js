import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createMilestone,
  getMilestones,
  getMilestoneById,
  submitMilestoneEvidence,
  approveMilestone,
  rejectMilestone
} from '../controllers/milestone.controller.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /milestones:
 *   post:
 *     summary: Create a milestone
 *     tags: [Milestones]
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
 *               - title
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               title:
 *                 type: string
 *                 example: Foundation Complete
 *               description:
 *                 type: string
 *                 example: Complete foundation work
 *               targetDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-31
 *               trancheAmount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Milestone created successfully
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
 *                     milestone:
 *                       $ref: '#/components/schemas/Milestone'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', createMilestone);

/**
 * @swagger
 * /milestones:
 *   get:
 *     summary: Get all milestones
 *     tags: [Milestones]
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
 *           enum: [pending, in_progress, submitted, approved, rejected]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Milestones retrieved successfully
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
 *                     milestones:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Milestone'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', getMilestones);

/**
 * @swagger
 * /milestones/{id}:
 *   get:
 *     summary: Get milestone by ID
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Milestone ID
 *     responses:
 *       200:
 *         description: Milestone retrieved successfully
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
 *                     milestone:
 *                       $ref: '#/components/schemas/Milestone'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getMilestoneById);

/**
 * @swagger
 * /milestones/{id}/evidence:
 *   post:
 *     summary: Submit milestone evidence
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Milestone ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - evidence
 *             properties:
 *               evidence:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://example.com/evidence.jpg
 *                     description:
 *                       type: string
 *                       example: Photo of completed foundation
 *     responses:
 *       200:
 *         description: Evidence submitted successfully
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
 *                     milestone:
 *                       $ref: '#/components/schemas/Milestone'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/evidence', submitMilestoneEvidence);

/**
 * @swagger
 * /milestones/{id}/approve:
 *   patch:
 *     summary: Approve milestone (admin only)
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Milestone ID
 *     responses:
 *       200:
 *         description: Milestone approved successfully
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
 *                     milestone:
 *                       $ref: '#/components/schemas/Milestone'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/approve', requireRole('admin'), approveMilestone);

/**
 * @swagger
 * /milestones/{id}/reject:
 *   patch:
 *     summary: Reject milestone (admin only)
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Milestone ID
 *     responses:
 *       200:
 *         description: Milestone rejected successfully
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
 *                     milestone:
 *                       $ref: '#/components/schemas/Milestone'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id/reject', requireRole('admin'), rejectMilestone);

export default router;
