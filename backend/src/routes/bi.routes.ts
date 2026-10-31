import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  getBusinessSummary, 
  getSalesTrend, 
  getAnomalies, 
  getMultiOutletSummary,
  getPredictionsAndAlerts,
  getCategoryBreakdown
} from '../controllers/bi.controller';

const router = express.Router();

router.use(authenticateToken);

router.get('/business-summary', getBusinessSummary);
router.get('/sales-trend', getSalesTrend);
router.get('/anomalies', getAnomalies);
router.get('/multi-outlet-summary', getMultiOutletSummary);
router.get('/predictions', getPredictionsAndAlerts);
router.get('/category-breakdown', getCategoryBreakdown);

export default router;
