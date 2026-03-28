import express from "express";

import auth from "../middleware/auth.js";
import MasterSetup from "../models/MasterSetup.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), async (req, res) => {
  const master = await MasterSetup.create(req.body);
  res.status(201).json(master);
});

router.get("/", auth(), async (_req, res) => {
  const data = await MasterSetup.find().sort({ createdAt: -1 });
  res.json(data);
});

export default router;
