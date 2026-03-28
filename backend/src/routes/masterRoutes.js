const express = require('express');
const MasterSetup = require('../models/MasterSetup');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(['ADMIN']), async (req, res) => {
  const master = await MasterSetup.create(req.body);
  res.status(201).json(master);
});

router.get('/', auth(), async (_req, res) => {
  const data = await MasterSetup.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;
