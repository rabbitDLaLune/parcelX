import { Router } from 'express';
import {
  getDriverReport,
  getParcelReport,
  getReportSummary,
  getRevenueReport,
} from '../controllers/report.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/summary', requireAuth, requireRole(['admin', 'staff']), getReportSummary);
router.get('/parcels', requireAuth, requireRole(['admin', 'staff']), getParcelReport);
router.get('/revenue', requireAuth, requireRole(['admin', 'staff']), getRevenueReport);
router.get('/drivers', requireAuth, requireRole(['admin', 'staff']), getDriverReport);

export default router;
