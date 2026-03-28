import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    category: { type: String, required: true },
    qualifyingExam: { type: String, required: true },
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
