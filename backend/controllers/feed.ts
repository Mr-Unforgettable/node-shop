import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/post";

// Custom HttpError class
class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

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

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationError = new HttpError(
        "Validation failed, entered data is incorrect.",
        422
      );
      console.error(validationError.statusCode);
      res.status(validationError.statusCode).json({
        message: validationError.message,
      });
      return;
    }

    const { title, content } = req.body;

    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      imageUrl: "images/googlepixel.png",
      creator: {
        name: "Abhianv",
      },
    });

    const result = await post.save();

    res.status(201).json({
      message: "Post created successfully.",
      post: result,
    });
  } catch (err) {
    return next(new HttpError("Failed to create a post", 500));
  }
};
