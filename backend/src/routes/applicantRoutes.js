const express = require("express");
const Applicant = require("../models/Applicant");
const auth = require("../middleware/auth");

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

module.exports = router;
