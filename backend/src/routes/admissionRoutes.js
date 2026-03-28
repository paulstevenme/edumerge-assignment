const express = require('express');
const mongoose = require('mongoose');
const Admission = require('../models/Admission');
const Applicant = require('../models/Applicant');
const Program = require('../models/Program');
const auth = require('../middleware/auth');
const generateAdmissionNumber = require('../utils/admissionNumber');

const router = express.Router();

router.post('/allocate', auth(['ADMIN', 'ADMISSION_OFFICER']), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicantId, programId, quotaType, allotmentNumber } = req.body;

    const applicant = await Applicant.findById(applicantId).session(session);
    const program = await Program.findById(programId).session(session);

    if (!applicant || !program) {
      throw new Error('Applicant or Program not found');
    }

    const existingAdmission = await Admission.findOne({ applicantId }).session(session);
    if (existingAdmission) {
      throw new Error('Seat already allocated for this applicant');
    }

    const quota = program.quotas.find((item) => item.type === quotaType);
    if (!quota) throw new Error('Invalid quota type');
    if (quota.filledSeats >= quota.seats) throw new Error('Quota full. Seat allocation blocked');

    quota.filledSeats += 1;
    applicant.admissionStatus = 'SEAT_LOCKED';
    await applicant.save({ session });
    await program.save({ session });

    const admission = await Admission.create(
      [
        {
          applicantId,
          programId,
          quotaType,
          allotmentNumber,
          seatLocked: true,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(admission[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

router.post('/confirm/:applicantId', auth(['ADMIN', 'ADMISSION_OFFICER']), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const applicant = await Applicant.findById(req.params.applicantId).session(session);
    const admission = await Admission.findOne({ applicantId: req.params.applicantId }).session(session);
    const program = await Program.findById(admission?.programId).session(session);

    if (!applicant || !admission || !program) {
      throw new Error('Admission record not found');
    }

    if (applicant.feeStatus !== 'Paid') {
      throw new Error('Admission can be confirmed only if fee is paid');
    }

    if (applicant.documentStatus !== 'Verified') {
      throw new Error('Documents must be verified before confirmation');
    }

    if (admission.admissionNumber) {
      throw new Error('Admission number already generated and immutable');
    }

    const institutionCode = (program.institution || 'INST').slice(0, 4).toUpperCase();
    const year = new Date().getFullYear();

    admission.admissionNumber = await generateAdmissionNumber({
      institutionCode,
      year,
      courseType: program.courseType,
      branchCode: program.branchCode,
      quotaType: admission.quotaType,
    });
    admission.confirmedAt = new Date();

    applicant.admissionStatus = 'CONFIRMED';

    await admission.save({ session });
    await applicant.save({ session });

    await session.commitTransaction();
    res.json({ message: 'Admission confirmed', admissionNumber: admission.admissionNumber });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

router.get('/', auth(), async (_req, res) => {
  const admissions = await Admission.find()
    .populate('applicantId')
    .populate('programId')
    .sort({ createdAt: -1 });
  res.json(admissions);
});

module.exports = router;
