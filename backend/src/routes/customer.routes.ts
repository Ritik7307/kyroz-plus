import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getCustomers, updateCustomer, deleteCustomer, bulkImportCustomers } from '../controllers/customer.controller';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.post('/bulk', bulkImportCustomers);

export default router;
