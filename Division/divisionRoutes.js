const express = require('express');
const divisionModel = require('./divisionModel');
const tokenRequired = require('../authMiddleware');

const router = express.Router();

// Create Division
router.post('/creatediv/', tokenRequired, async (req, res) => {
    const { status, response } = await divisionModel.createDivision(req.currentUser, req.body);
    res.status(status).json(response);
});

// Update Division
router.post('/updatediv/', tokenRequired, async (req, res) => {
    const { status, response } = await divisionModel.updateDivision(req.currentUser, req.body);
    res.status(status).json(response);
});

// Delete Division
router.post('/deletediv/', tokenRequired, async (req, res) => {
    const { status, response } = await divisionModel.deleteDivision(req.currentUser, req.body);
    res.status(status).json(response);
});

// Get Division
router.get('/divs/', tokenRequired, async (req, res) => {
    const { status, response } = await divisionModel.getDivisionDetail();
    res.status(status).json(response);
});

// Get Division By Id
router.post('/divsbyid/', tokenRequired, async (req, res) => {
    const { status, response } = await divisionModel.getDivisionById(req.body);
    res.status(status).json(response);
});

// Search Division
router.post('/searchdivs/', tokenRequired, async (req, res) => {
    const { status, response } = await divisionModel.searchDivision(req.body);
    res.status(status).json(response);
});

module.exports = router;
