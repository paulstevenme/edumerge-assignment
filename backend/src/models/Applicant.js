import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    qualifyingExam: { type: String, required: true, trim: true },
    marks: { type: Number, required: true },
    entryType: { type: String, enum: ["Regular", "Lateral"], required: true },
    quotaType: {
      type: String,
      enum: ["KCET", "COMEDK", "Management"],
      required: true,
    },
    documentStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Verified"],
      default: "Pending",
    },
    feeStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    admissionStatus: {
      type: String,
      enum: ["APPLIED", "SEAT_LOCKED", "CONFIRMED"],
      default: "APPLIED",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Applicant", applicantSchema);
