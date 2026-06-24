const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  activityTitle: String,
  studentEmail: String,
  studentCount: Number,
  studentNames: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);