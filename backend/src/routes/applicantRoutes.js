import express from "express";

import auth from "../middleware/auth.js";
import Applicant from "../models/Applicant.js";

const router = express.Router();

router.post("/", auth(["ADMISSION_OFFICER"]), async (req, res) => {
  const applicant = await Applicant.create(req.body);
  res.status(201).json(applicant);
});

router.get("/", auth(), async (_req, res) => {
  const applicants = await Applicant.find().sort({ createdAt: -1 });
  res.json(applicants);
});

router.patch("/:id", auth(["ADMISSION_OFFICER"]), async (req, res) => {
  const applicant = await Applicant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!applicant)
    return res.status(404).json({ message: "Applicant not found" });
  res.json(applicant);
});

export default router;
