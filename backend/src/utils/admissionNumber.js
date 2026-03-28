const Admission = require('../models/Admission');

const pad = (num) => String(num).padStart(4, '0');

async function generateAdmissionNumber({ institutionCode, year, courseType, branchCode, quotaType }) {
  const prefix = `${institutionCode}/${year}/${courseType}/${branchCode}/${quotaType}`;
  const count = await Admission.countDocuments({ admissionNumber: new RegExp(`^${prefix}`) });
  return `${prefix}/${pad(count + 1)}`;
}

module.exports = generateAdmissionNumber;
