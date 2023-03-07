const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
const loginsController = require('../../controllers/loginsController');
const { validateLogin } = require('../../middleware/validator');



router
  .route('/')
  .get(auth, loginsController.getLoginUser)
  .post( validateLogin, loginsController.loginUser)

 module.exports = router;
