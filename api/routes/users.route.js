const express = require('express');
const usersRouter = express.Router();
const User = require('../models/userSchema');

//GET request for all users
usersRouter.get("/", async (req,res)=>{
    let users = await User.find({},{_id:0});
    res.status(200).send(users);
});

//GET request for user by email
usersRouter.get("/:email", async (req,res)=>{
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
});

//POST request to add new user
usersRouter.post("/register", async (req,res)=>{
    console.log("Received user data:", req.body);
    let user = new User(req.body);
    await user.save();
    res.status(200).send(user);
});

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
