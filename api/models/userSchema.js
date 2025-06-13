const mongoose = require("mongoose");

// secheme  for grade level
// This schema defines the structure of the grade level data for each user
const gradeLevelSchema = new mongoose.Schema(
  {
    Addition: { type: Number, default: 0 },
    Subtraction: { type: Number, default: 0 },
    Multiplication: { type: Number, default: 0 },
    Division: { type: Number, default: 0 },
    Percentage: { type: Number, default: 0 }
  },
  { _id: false }
);

const defaultGradeLevels = () => Array(6).fill({
  Addition: 0,
  Subtraction: 0,
  Multiplication: 0,
  Division: 0,
  Percentage: 0
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    grade: { type: Number, required: true },
    avatar: {
      type: String,
      default: "/src/assets/Images/Avatars/avatar1.png"
    },
    streak: { type: Number, default: 0 },
    pop_quiz_last_date: { type: Date, default: null },
    gradeLevel: {
      type: [gradeLevelSchema],
      default: defaultGradeLevels,
      validate: {
        validator: function (val) {
          return val.length === 6;
        },
        message: "gradeLevel must have exactly 6 entries"
      }
    }
  },
  { collection: "Users", versionKey: false }
);

module.exports = mongoose.model("Users", userSchema);