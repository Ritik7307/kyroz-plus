import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const getMyData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let unlockedFeatures = ['sop_library'];
    if (user.subscriptionPlan === 'Pro' || user.subscriptionPlan === 'Elite' || user.subscriptionPlan === 'Admin') {
      unlockedFeatures.push('costing_tools', 'unlimited_ai');
    }
    if (user.subscriptionPlan === 'Elite' || user.subscriptionPlan === 'Admin') {
      unlockedFeatures.push('scaling_strategy');
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.subscriptionPlan,
        shopName: user.shopName,
        features: unlockedFeatures
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user data' });
  }
};

export const addStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, permissions } = req.body;
    const managerId = req.user?.userId;

    const manager = await User.findById(managerId);
    if (!manager) {
      res.status(404).json({ error: 'Owner not found' });
      return;
    }

    // Enforce 3 slot limit (Manager, Cook, Biller)
    const existingStaffCount = await User.countDocuments({ ownerId: managerId });
    if (existingStaffCount >= 3) {
      res.status(400).json({ error: 'Maximum limit of 3 staff slots reached.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = new User({
      email,
      password: hashedPassword,
      name,
      role,
      permissions: permissions || [],
      ownerId: managerId,
      shopName: manager.shopName,
      shopAddress: manager.shopAddress,
      gstNumber: manager.gstNumber,
      subscriptionPlan: manager.subscriptionPlan // Inherit plan
    });

    await newStaff.save();
    res.status(201).json({ message: 'Staff added successfully', staff: newStaff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add staff' });
  }
};

export const getStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const managerId = req.user?.userId;
    const staff = await User.find({ ownerId: managerId }).select('-password -otpHash');
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, permissions, name, password } = req.body;
    const managerId = req.user?.userId;

    const staff = await User.findOne({ _id: id, ownerId: managerId });
    if (!staff) {
      res.status(404).json({ error: 'Staff member not found or unauthorized' });
      return;
    }

    if (role) staff.role = role;
    if (permissions) staff.permissions = permissions;
    if (name) staff.name = name;
    if (password) {
      staff.password = await bcrypt.hash(password, 10);
    }

    await staff.save();
    res.status(200).json({ message: 'Staff updated successfully', staff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

export const deleteStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const managerId = req.user?.userId;

    const result = await User.deleteOne({ _id: id, ownerId: managerId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Staff member not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Staff member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove staff member' });
  }
};
