import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Post",
        Content: "This is the first post!",
        imageUrl: "images/googlepixel.png",
        creator: {
          name: "Abhinav",
        },
        createdAt: new Date(),
      },
    ],
  });
};

export const createPost: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .json({
        message: "Validation failed, entered data is incorrect.",
        errors: errors.array(),
      });
  }
  
  const { title, content } = req.body;

  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "Abhianv",
      },
      createdAt: new Date(),
    },
  });
};
