import express from 'express';
import { buildFromFold } from '@vishnu/core';

const router = express.Router();

router.post('/builders/neutral', (req, res) => {
  const fold = req.body;
  const meshes = buildFromFold(fold);
  res.json({ meshes });
});

export default router;
