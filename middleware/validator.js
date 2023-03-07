const { check } = require('express-validator')

const validateUserCreate = ([
  check('username', 'username is required').not().isEmpty(),
  check('email', 'Please include a valid email address').isEmail(),
  check(
    'password',
    'Please enter a password in range of 6 to 100 characters'
  ).isLength({ min: 6, max: 100 }),
]
)

module.exports = {
  validateUserCreate
};
