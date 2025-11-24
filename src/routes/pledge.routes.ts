import { Router } from 'express';
import {
  createPledge,
  getMyPledges,
  getProjectPledges,
  getPledgeById,
  createPledgeValidation,
} from '../controllers/pledge.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, validate(createPledgeValidation), createPledge);
router.get('/mine', authenticate, getMyPledges);
router.get('/projects/:id', getProjectPledges);
router.get('/:id', authenticate, getPledgeById);

export default router;

