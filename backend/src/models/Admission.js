import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
      unique: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    quotaType: {
      type: String,
      enum: ["KCET", "COMEDK", "Management"],
      required: true,
    },
    allotmentNumber: { type: String },
    seatLocked: { type: Boolean, default: false },
    admissionNumber: { type: String, unique: true, sparse: true },
    confirmedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Admission", admissionSchema);
