const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const usersController = require('../../controllers/usersController')
const auth = require('../../middleware/auth')
const {validateUserCreate} = require('../../middleware/validator')

router
  .route('/')
  .get(auth, usersController.getAllUsers)
  .post(
  validateUserCreate,
  usersController.createUser)

router.get("/:username",auth, usersController.getUser)

module.exports = router
