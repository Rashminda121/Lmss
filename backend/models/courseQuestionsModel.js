const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
    },
    uname: {
      type: String,
      default: "",
      minlength: [2, "Username must be at least 2 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    text: {
      type: String,
      default: "",
      minlength: [2, "Answer must be at least 2 characters long"],
      maxlength: [1000, "Answer cannot exceed 1000 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const courseQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
    },
    uname: {
      type: String,
      default: "Anonymous",
    },
    courseId: {
      type: String,
      default: "",
    },
    chapterId: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
courseQuestionSchema.index({ courseId: 1 });
courseQuestionSchema.index({ chapterId: 1 });
courseQuestionSchema.index({ userId: 1 });
courseQuestionSchema.index({ createdAt: -1 });

// Virtual for formatted createdAt date
courseQuestionSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const CourseQuestion =
  mongoose.models.CourseQuestion ||
  mongoose.model("CourseQuestion", courseQuestionSchema);

module.exports = CourseQuestion;
