import express from "express";

import auth from "../middleware/auth.js";
import Program from "../models/Program.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), async (req, res) => {
  const { intake, quotas } = req.body;
  const totalQuotaSeats = quotas.reduce(
    (sum, item) => sum + Number(item.seats || 0),
    0,
  );

  if (totalQuotaSeats !== Number(intake)) {
    return res
      .status(400)
      .json({ message: "Total base quota must equal intake" });
  }

  const duplicateProgram = await Program.findOne({
    institution: req.body.institution?.trim(),
    campus: req.body.campus?.trim(),
    department: req.body.department?.trim(),
    programName: req.body.programName?.trim(),
    branchCode: req.body.branchCode?.trim().toUpperCase(),
    academicYear: req.body.academicYear?.trim(),
    courseType: req.body.courseType,
    entryType: req.body.entryType,
  });

  if (duplicateProgram) {
    return res.status(409).json({
      message: "Program already exists for the same academic setup",
    });
  }

  const program = await Program.create({
    ...req.body,
    branchCode: req.body.branchCode?.trim().toUpperCase(),
  });
  res.status(201).json(program);
});

router.get("/", auth(), async (_req, res) => {
  const programs = await Program.find().sort({ createdAt: -1 });
  res.json(programs);
});

router.get("/:id", auth(), async (req, res) => {
  const program = await Program.findById(req.params.id);
  if (!program) return res.status(404).json({ message: "Program not found" });
  res.json(program);
});

export default router;
