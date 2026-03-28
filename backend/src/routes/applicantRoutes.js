import express from "express";

import auth from "../middleware/auth.js";
import Applicant from "../models/Applicant.js";

const router = express.Router();

const normalizeApplicantIdentity = (payload) => ({
  email: payload.email?.trim().toLowerCase(),
  mobile: payload.mobile?.trim(),
});

router.post("/", auth(["ADMISSION_OFFICER"]), async (req, res) => {
  const { email, mobile } = normalizeApplicantIdentity(req.body);
  const duplicateApplicant = await Applicant.findOne({
    $or: [{ email }, { mobile }],
  });

  if (duplicateApplicant) {
    return res.status(409).json({
      message: "Applicant with the same email or mobile already exists",
    });
  }

  const applicant = await Applicant.create({
    ...req.body,
    email,
    mobile,
  });
  res.status(201).json(applicant);
});

router.get("/", auth(), async (_req, res) => {
  const applicants = await Applicant.find().sort({ createdAt: -1 });
  res.json(applicants);
});

router.patch("/:id", auth(["ADMISSION_OFFICER"]), async (req, res) => {
  if (req.body.email || req.body.mobile) {
    const { email, mobile } = normalizeApplicantIdentity({
      email: req.body.email,
      mobile: req.body.mobile,
    });

    const duplicateApplicant = await Applicant.findOne({
      _id: { $ne: req.params.id },
      $or: [...(email ? [{ email }] : []), ...(mobile ? [{ mobile }] : [])],
    });

    if (duplicateApplicant) {
      return res.status(409).json({
        message: "Applicant with the same email or mobile already exists",
      });
    }

    if (email) req.body.email = email;
    if (mobile) req.body.mobile = mobile;
  }

  const applicant = await Applicant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!applicant)
    return res.status(404).json({ message: "Applicant not found" });
  res.json(applicant);
});

export default router;
