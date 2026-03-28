import express from "express";

import Applicant from "../models/Applicant.js";
import auth from "../middleware/auth.js";
import Program from "../models/Program.js";

const router = express.Router();

router.get("/", auth(), async (_req, res) => {
  const programs = await Program.find();
  const applicants = await Applicant.find();

  const totalIntake = programs.reduce((sum, item) => sum + item.intake, 0);
  const totalAdmitted = applicants.filter(
    (item) => item.admissionStatus === "CONFIRMED",
  ).length;
  const pendingDocuments = applicants.filter(
    (item) => item.documentStatus !== "Verified",
  );
  const feePending = applicants.filter((item) => item.feeStatus === "Pending");

  const quotaWise = programs.flatMap((program) =>
    program.quotas.map((quota) => ({
      program: program.programName,
      quota: quota.type,
      total: quota.seats,
      filled: quota.filledSeats,
      remaining: quota.seats - quota.filledSeats,
    })),
  );

  res.json({
    summary: {
      totalIntake,
      totalAdmitted,
      remainingSeats: totalIntake - totalAdmitted,
    },
    quotaWise,
    pendingDocuments,
    feePending,
  });
});

export default router;
