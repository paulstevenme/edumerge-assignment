import express from 'express';

import auth from '../middleware/auth.js';
import Program from '../models/Program.js';

const router = express.Router();

router.post('/', auth(['ADMIN']), async (req, res) => {
  const { intake, quotas } = req.body;
  const totalQuotaSeats = quotas.reduce((sum, item) => sum + Number(item.seats || 0), 0);

  if (totalQuotaSeats !== Number(intake)) {
    return res.status(400).json({ message: 'Total base quota must equal intake' });
  }

  const program = await Program.create(req.body);
  res.status(201).json(program);
});

router.get('/', auth(), async (_req, res) => {
  const programs = await Program.find().sort({ createdAt: -1 });
  res.json(programs);
});

router.get('/:id', auth(), async (req, res) => {
  const program = await Program.findById(req.params.id);
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json(program);
});

export default router;
