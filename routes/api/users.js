const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const usersController = require('../../controllers/usersController')

// @route     POST api/users
// @desc      Register Route
// @access    Public
router.post(
  '/',
  [
    check('username', 'username is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password in range of 6 to 100 characters'
    ).isLength({ min: 6, max: 100 }),
  ],
  usersController.createUser
)

module.exports = router
