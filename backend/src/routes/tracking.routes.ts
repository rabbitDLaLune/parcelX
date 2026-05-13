import { Router } from 'express';
import { trackParcel } from '../controllers/tracking.controller';

const router = Router();

router.get('/:trackingNumber', trackParcel);

export default router;
