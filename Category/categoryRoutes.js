const express = require('express');
const categoryModel = require('./categoryModel');
const tokenRequired = require('../authMiddleware');

const router = express.Router();

// Create Category
router.post('/createcat/', tokenRequired, async (req, res) => {
    const { status, response } = await categoryModel.createCategory(req.currentUser, req.body);
    res.status(status).json(response);
});

// Update Category
router.post('/updatecat/', tokenRequired, async (req, res) => {
    const { status, response } = await categoryModel.updateCategory(req.currentUser, req.body);
    res.status(status).json(response);
});

// Delete Category
router.post('/deletecat/', tokenRequired, async (req, res) => {
    const { status, response } = await categoryModel.deleteCategory(req.currentUser, req.body);
    res.status(status).json(response);
});

// Get Category
router.get('/cats/', tokenRequired, async (req, res) => {
    const { status, response } = await categoryModel.getCategoryDetail();
    res.status(status).json(response);
});

// Get Category By Id
router.post('/catsbyid/', tokenRequired, async (req, res) => {
    const { status, response } = await categoryModel.getCategoryById(req.body);
    res.status(status).json(response);
});

// Search Category
router.post('/searchcats/', tokenRequired, async (req, res) => {
    const { status, response } = await categoryModel.searchCategory(req.body);
    res.status(status).json(response);
});

module.exports = router;
