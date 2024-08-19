// userRoutes.js
const express = require('express');
const userModel = require('./UserModel');
const tokenRequired = require('../authMiddleware');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { status, response } = await userModel.login(req.body);
    res.status(status).json(response);
});

// Get user details route (for admins)
router.get('/username/', tokenRequired, async (req, res) => {
    const { status, response } = await userModel.getUser(req.currentUser);
    res.status(status).json(response);
});

// Update user details route (for admins)
router.post('/updateuser/', tokenRequired, async (req, res) => {
    const { status, response } = await userModel.updateUser(req.currentUser, req.body);
    res.status(status).json(response);
});

// Other routes for usersDetail, getUser, updateUser, deleteUser would follow the same pattern

module.exports = router;
