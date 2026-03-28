import mongoose from "mongoose";

const masterSetupSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    campus: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true, trim: true },
    courseType: { type: String, enum: ["UG", "PG"], required: true },
    entryType: { type: String, enum: ["Regular", "Lateral"], required: true },
    admissionMode: {
      type: String,
      enum: ["Government", "Management"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MasterSetup", masterSetupSchema);
