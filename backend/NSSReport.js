const mongoose = require("mongoose");

const nssReportSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NSSReport", nssReportSchema);