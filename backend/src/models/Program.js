const mongoose = require('mongoose');

const quotaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['KCET', 'COMEDK', 'Management'],
      required: true,
    },
    seats: { type: Number, required: true, min: 0 },
    filledSeats: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    campus: { type: String, required: true },
    department: { type: String, required: true },
    programName: { type: String, required: true },
    branchCode: { type: String, required: true, uppercase: true, trim: true },
    academicYear: { type: String, required: true },
    courseType: { type: String, enum: ['UG', 'PG'], required: true },
    entryType: { type: String, enum: ['Regular', 'Lateral'], required: true },
    intake: { type: Number, required: true, min: 1 },
    quotas: { type: [quotaSchema], validate: (arr) => arr.length > 0 },
    supernumerarySeats: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', programSchema);
