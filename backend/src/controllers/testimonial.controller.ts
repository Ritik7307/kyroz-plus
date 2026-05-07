import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Testimonial from '../models/Testimonial';

export const createTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userName, userRole, content, avatarUrl, rating } = req.body;
    const newTestimonial = new Testimonial({ userName, userRole, content, avatarUrl, rating });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Testimonial' });
  }
};

export const getTestimonials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Testimonials' });
  }
};

export const updateTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userName, userRole, content, avatarUrl, rating } = req.body;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { userName, userRole, content, avatarUrl, rating },
      { new: true }
    );
    if (!updatedTestimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Testimonial' });
  }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Testimonial' });
  }
};
