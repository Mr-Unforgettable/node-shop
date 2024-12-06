import { RequestHandler } from 'express';
import { User } from '../models/user';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

// Custom HttpError class
class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { email, name, password } = req.body;
    if (!errors.isEmpty()) {
      const validationError = new HttpError(
        'Validation failed, entered data is incorrect.',
        422
      );
      res.status(validationError.statusCode).json({
        message: validationError.message,
      });
      return;
    }

    // Salting and hashing password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });

    const result = await user.save();
    res.status(201).json({
      message: 'User Created!',
      userId: result._id,
    });
  } catch (error) {
    return next(new HttpError('failed to signup', 500));
  }
};
