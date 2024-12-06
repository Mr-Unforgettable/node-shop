import { body } from 'express-validator';

/** This middleware function checks for server-side validation for the createPost route. */
export const createPostsValidationRules = () => {
  return [
    body('title').trim().isLength({ min: 5 }),

    body('content').trim().isLength({ min: 5 }),
  ];
};

/** This middleware function checks for server-side validation for the updatePost route. */
export const updatePostsValidationRules = () => {
  return [
    body('title').trim().isLength({ min: 5 }),

    body('content').trim().isLength({ min: 5 }),
  ];
};
