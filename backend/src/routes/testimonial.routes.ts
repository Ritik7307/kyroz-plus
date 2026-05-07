import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import { 
  createTestimonial, 
  getTestimonials, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonial.controller';

const router = Router();

router.get('/', getTestimonials); // Publicly accessible
router.post('/', authenticateToken, isAdmin, createTestimonial);
router.put('/:id', authenticateToken, isAdmin, updateTestimonial);
router.delete('/:id', authenticateToken, isAdmin, deleteTestimonial);

export default router;
