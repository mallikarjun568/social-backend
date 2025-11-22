const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const logger = require('../utils/logger');

const UserService = {
  async getProfile(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created_at,
      };
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  },

  async updateProfile(userId, updateData) {
    try {
      const dbUpdateData = {};
      
      if (updateData.firstName !== undefined) dbUpdateData.first_name = updateData.firstName;
      if (updateData.lastName !== undefined) dbUpdateData.last_name = updateData.lastName;
      if (updateData.bio !== undefined) dbUpdateData.bio = updateData.bio;
      if (updateData.avatar !== undefined) dbUpdateData.avatar = updateData.avatar;

      const updatedUser = await UserModel.update(userId, dbUpdateData);
      if (!updatedUser) {
        throw new Error('User not found');
      }

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      };
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  },

  async updatePassword(userId, currentPassword, newPassword) {
    try {
      const user = await UserModel.findByEmail(
        (await UserModel.findById(userId)).email
      );

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.update(userId, { password: hashedPassword });

      return { message: 'Password updated successfully' };
    } catch (error) {
      logger.error('Update password error:', error);
      throw error;
    }
  },
};

module.exports = UserService;


