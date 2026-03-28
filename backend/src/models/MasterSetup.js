import mongoose from "mongoose";

const masterSetupSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    campus: { type: String, required: true },
    department: { type: String, required: true },
    academicYear: { type: String, required: true },
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
