import express from 'express';
import { signupValidationRules } from '../validators/signupValidation';
import { signup } from '../controllers/auth';

const router = express.Router();

router.put('/signup', signupValidationRules(), signup);

export default router;
