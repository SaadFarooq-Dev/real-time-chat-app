const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');


// @route     Get api/auth
// @desc      User Auth Route
// @access    Private
const getLoginUser =  async (req, res) => {
  try {
   const user = await UserModel.findById(req.user.id).select('-password');
   res.json(user);
  } catch (error) {
   console.error(error.message);
   res.status(500).send('Server Error');
  }
}

// @route     POST api/auth
// @desc      Authenticate User & get token
// @access    Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
   let user = await UserModel.findOne({ email });
   if (!user) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
   }

   const isMatch = await bcrypt.compare(password, user.password);

   if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
   }
   const payload = {
    user: {
     id: user.id,
    },
   };

   jwt.sign(
    payload,
    process.env.jwtSecret,
    { expiresIn: 3600 },
    async (err, token) => {
     if (err) throw err;
     res.json({ token, user });
    }
   );
  } catch (error) {
   console.error(error.message);
   res.status(500).send('Server Error');
  }
 }
module.exports = {
  loginUser,
  getLoginUser,
};
