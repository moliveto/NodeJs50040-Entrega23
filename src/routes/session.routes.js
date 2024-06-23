import { Router } from 'express';
import passport from 'passport';
import { createUser, logoutUser, loginUser } from '../controllers/userController.js';

const router = Router();

// Register route
router.post('/register', createUser);

// Login route
router.post('/login', passport.authenticate('login', {
    failureRedirect: '/login',
    failureFlash: true,
    session: false,
  }), loginUser);

// Logout route
router.get('/logout', logoutUser);

// Current user route
router.get('/current', requireAuth, userController.current);

// Reset password route
router.post('/resetpassword', userController.resetPassword);

// Update password route
router.post('/updatepassword', requireAuth, userController.updatePassword);

export default router;