const mongoose = require("mongoose");

// secheme  for grade level
// This schema defines the structure of the grade level data for each user
/**
 * GradeLevel schema
 * @typedef {Object} GradeLevel
 * @property {Number} Addition - Points for addition problems
 * @property {Number} Subtraction - Points for subtraction problems
 * @property {Number} Multiplication - Points for multiplication problems
 * @property {Number} Division - Points for division problems
 * @property {Number} Percentage - Points for percentage problems
 * @description This schema is used to track the progress of a user in different math operations across grade levels.
 */
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

/**
 * Generates default grade level data for a user.
 * @returns {Array<GradeLevel>} - An array of GradeLevel objects.
 */
const defaultGradeLevels = () => Array(6).fill({
  Addition: 0,
  Subtraction: 0,
  Multiplication: 0,
  Division: 0,
  Percentage: 0
});

/**
 * User schema
 * @typedef {Object} User
 * @property {String} name - The name of the user.
 * @property {String} email - The email of the user, must be unique.
 * @property {String} password - The password of the user.
 * @property {Number} grade - The grade of the user, must be between 1 and 6.
 * @property {String} avatar - The avatar of the user, default is a placeholder image.
 * @property {Number} streak - The user's current streak, default is 0.
 * @property {Date} pop_quiz_last_date - The last date the user took a pop quiz, default is null.
 * @property {Array<GradeLevel>} gradeLevel - An array of GradeLevel objects representing the user's progress in different math operations across grade levels.
 * * @description This schema is used to store user information in the database.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    grade: { type: Number, required: true },
    avatar: {
      type: String,
      default: "/assets/avatar2-Ckl0_2IZ.png"
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