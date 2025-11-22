const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const AuthService = {
  async register(userData) {
    try {
      const { email, password, username } = userData;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        throw new Error('Username already taken');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        token,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken({ userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          bio: user.bio,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  },
};

module.exports = AuthService;


