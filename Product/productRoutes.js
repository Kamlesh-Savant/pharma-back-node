const express = require('express');
const productModel = require('./productModel');  // Assuming the file is named productModel.js
const tokenRequired = require('../authMiddleware');

const router = express.Router();

// Create Product
router.post('/createprod/', tokenRequired, async (req, res) => {
    try {
        const { status, response } = await productModel.createProduct(req.currentUser, req.body);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Product
router.post('/updateprod/', tokenRequired, async (req, res) => {
    try {
        const { status, response } = await productModel.updateProduct(req.currentUser, req.body);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Product
router.post('/deleteprod/', tokenRequired, async (req, res) => {
    try {
        const { status, response } = await productModel.deleteProduct(req.currentUser, req.body);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Products
router.get('/prods/', tokenRequired, async (req, res) => {
    try {
        const { status, response } = await productModel.getProductDetail(req.currentUser);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Product By Id
router.post('/prodbyid/', tokenRequired, async (req, res) => {
    try {
        const { status, response } = await productModel.productById(req.body);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Products By Search
router.post('/searchprods/', tokenRequired, async (req, res) => {
    try {
        const { status, response } = await productModel.productSearch(req.body);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
