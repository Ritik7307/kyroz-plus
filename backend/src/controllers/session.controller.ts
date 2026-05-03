import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Session from '../models/Session';

export const getActiveSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessions = await Session.find({ userId }).sort({ lastActive: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const deleted = await Session.findOneAndDelete({ _id: id, userId });
    
    if (!deleted) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.status(200).json({ message: 'Device logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
};
