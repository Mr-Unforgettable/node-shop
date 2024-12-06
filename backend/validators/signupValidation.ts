import { body } from 'express-validator';
import { User } from '../models/user';

/** This validation check for the /auth/signup route */
export const signupValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('E-mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ];
};
