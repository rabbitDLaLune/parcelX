import { Router } from 'express';
import {
  assignDriver,
  createParcel,
  getAllParcels,
  getDashboardStats,
  getParcelById,
  markDelivered,
  markFailed,
  updateParcelStatus,
} from '../controllers/parcel.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, requireRole(['admin', 'staff', 'customer']), getAllParcels);
router.get('/dashboard/stats', requireAuth, requireRole(['admin', 'staff']), getDashboardStats);

router.post('/', requireAuth, requireRole(['admin', 'staff', 'customer']), createParcel);

router.get(
  '/:id',
  requireAuth,
  requireRole(['admin', 'staff', 'driver', 'customer']),
  getParcelById,
);

router.post('/:id/status', requireAuth, requireRole(['admin', 'staff']), updateParcelStatus);

router.post('/:id/assign-driver', requireAuth, requireRole(['admin', 'staff']), assignDriver);

router.post('/:id/delivered', requireAuth, requireRole(['driver']), markDelivered);

router.post('/:id/failed', requireAuth, requireRole(['driver']), markFailed);

export default router;
