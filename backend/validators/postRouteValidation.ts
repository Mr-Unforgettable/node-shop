import { body } from "express-validator";

/** This middleware function checks for server-side validation for the createPost route. */
export const createPostsValidationRules = () => {
    return [
        body('title')
            .trim()
            .isLength({ min: 5 }),

        body('content')
            .trim()
            .isLength({ min: 5 }),
    ];
};

export const updatePostsValidationRules = () => {
    return [
        body('title')
            .trim()
            .isLength({ min: 5 }),

        body('content')
            .trim()
            .isLength({ min: 5 }),
    ];
};