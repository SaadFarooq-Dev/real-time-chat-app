const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const usersController = require('../../controllers/usersController')
const {validateUserCreate} = require('../../middleware/validator')

// @route     POST api/users
// @desc      Register Route
// @access    Public
router
  .route('/')
  .get(usersController.getAllUsers)
  .post(
  validateUserCreate,
  usersController.createUser)

router.get("/:username",usersController.getUser)

module.exports = router
