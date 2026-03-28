import express from "express";

import auth from "../middleware/auth.js";
import MasterSetup from "../models/MasterSetup.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), async (req, res) => {
  const duplicateMaster = await MasterSetup.findOne({
    institution: req.body.institution?.trim(),
    campus: req.body.campus?.trim(),
    department: req.body.department?.trim(),
    academicYear: req.body.academicYear?.trim(),
    courseType: req.body.courseType,
    entryType: req.body.entryType,
    admissionMode: req.body.admissionMode,
  });

  if (duplicateMaster) {
    return res.status(409).json({
      message: "Master setup already exists for the same configuration",
    });
  }

  const master = await MasterSetup.create(req.body);
  res.status(201).json(master);
});

router.get("/", auth(), async (_req, res) => {
  const data = await MasterSetup.find().sort({ createdAt: -1 });
  res.json(data);
});

export default router;
