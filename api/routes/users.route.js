const express = require('express');
const usersRouter = express.Router();
const User = require('../models/userSchema');
/**
 * @route GET /users
 * @returns {Array<User>} - The list of all users
 */
usersRouter.get("/", async (req,res)=>{
    let users = await User.find({},{_id:0});
    res.status(200).send(users);
});
/**
 * @route GET /users/:email
 * @param {string} email - The email of the user to retrieve
 * @returns {User} - The user with the specified email
 */
usersRouter.get("/:email", async (req,res)=>{
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
});
/**
 * @route POST /users/register
 * @param {User} user - The user to register
 * @returns {User} - The registered user
 */
usersRouter.post("/register", async (req,res)=>{
    console.log("Received user data:", req.body);
    let user = new User(req.body);
    await user.save();
    res.status(200).send(user);
});
/** 
 * @route PUT /users/update/:email
 * @param {string} email - The email of the user to update
 */
//PUT request to update all user details by email
usersRouter.put("/update/:email", async (req,res)=>{
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: req.body },
      { new: true } 
    );
    res.status(200).send(updatedUser);
});

module.exports = usersRouter;
