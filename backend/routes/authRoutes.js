const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getAllUsers, updateUserRole  } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/user', authenticateToken, getAllUsers);
router.put('/users/:userId', authenticateToken, authorizeRoles('admin'), updateUserRole);
// router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
//     res.send('This is an admin-only route');
//   });

module.exports = router;
