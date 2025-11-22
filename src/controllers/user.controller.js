const UserService = require('../services/user.service');

const UserController = {
  async getProfile(req, res, next) {
    try {
      const profile = await UserService.getProfile(req.user.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updatedProfile = await UserService.updateProfile(req.user.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await UserService.updatePassword(req.user.userId, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;


