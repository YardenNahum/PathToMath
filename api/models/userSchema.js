const mongoose = require("mongoose");
/**
 * LevelData schema
 * @typedef {Object} LevelData
 * @property {Number} level - The current level of the user, default is 0
 * @property {Number} totalTries - The total number of tries the user has made, default is 0
 * @property {Number} currentLevelTries - The number of tries the user has made in the current level, default is 0
 * * @description This schema is used to track the user's progress in different levels of games
 */
const levelDataSchema = new mongoose.Schema({
  level: { type: Number, default: 0 },
  totalTries: { type: Number, default: 0 },
  currentLevelTries: { type: Number, default: 0 },
}, { _id: false });
// secheme  for grade level
// This schema defines the structure of the grade level data for each user
/**
 * GradeLevel schema
 * @typedef {Object} GradeLevel
 * @property {LevelData} Addition - The user's progress in addition for the grade level.
 * @property {LevelData} Subtraction - The user's progress in subtraction for the grade level.
 * @property {LevelData} Multiplication - The user's progress in multiplication for the grade level
 * @property {LevelData} Division - The user's progress in division for the grade level.
 * @property {LevelData} Percentage - The user's progress in percentage for the grade level.
 * * @description This schema is used to track the user's progress in different math operations across grade levels.
 */
const gradeLevelSchema = new mongoose.Schema({
  Addition: { type: levelDataSchema, default: () => ({}) },
  Subtraction: { type: levelDataSchema, default: () => ({}) },
  Multiplication: { type: levelDataSchema, default: () => ({}) },
  Division: { type: levelDataSchema, default: () => ({}) },
  Percentage: { type: levelDataSchema, default: () => ({}) }
}, { _id: false });

/**
 * defaultGradeLevels function
 * @returns {Array<GradeLevel>} - An array of default grade levels with empty progress for each operation.
 * @description This function generates the default grade levels for a new user, ensuring each grade level
 * has an object for each math operation with default values.
 */
const defaultGradeLevels = () =>
  Array.from({ length: 6 }, () => ({
    Addition: { level: 0, totalTries: 0, currentLevelTries: 0 },
    Subtraction: { level: 0, totalTries: 0,  currentLevelTries: 0 },
    Multiplication: { level: 0, totalTries: 0,  currentLevelTries: 0 },
    Division: { level: 0, totalTries: 0, currentLevelTries: 0 },
    Percentage: { level: 0, totalTries: 0,  currentLevelTries: 0 }
  }));


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