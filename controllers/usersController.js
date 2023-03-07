const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = (async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

// @desc Get a user
// @route GET /users/:username
// @access Private
const getUser = (async (req, res) => {
  const { username } = req.params;

  // Get users from MongoDB
  const users = await User.find({ username }).select("-password").lean().exec();

  // If no users
  if (!users?.length) {
    return res
      .status(400)
      .json({ message: `No user with the username ${username} found` });
  }

  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createUser =   async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, email, password } = req.body
  try {
    let user = await UserModel.findOne({ email })
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    user = new UserModel({ username, email, password })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 3600 },
      async (err, token) => {
        if (err) throw err
        await user.save()
        res.json({ token })
      }
    )
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
}
module.exports = {
  getAllUsers,
  getUser,
  createUser,
};
