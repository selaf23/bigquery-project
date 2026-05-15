const express = require('express');
const config = require('../config');
const mockService = require('../services/mockData');
const bigqueryService = require('../services/bigquery');

const router = express.Router();

function getService() {
  return config.datasource === 'bigquery' ? bigqueryService : mockService;
}

router.get('/summary', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await getService().getSummary(from, to);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await getService().getRevenueOverTime(from, to);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await getService().getSalesByCategory(from, to);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/regions', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await getService().getSalesByRegion(from, to);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthly-trend', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await getService().getMonthlyTrend(from, to);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
