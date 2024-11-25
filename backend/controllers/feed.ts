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

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find();
    if (posts) {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
      })
    }
  } catch (err) {
    return next(new HttpError('Failed to fetch posts.', 500));
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationError = new HttpError(
        "Validation failed, entered data is incorrect.",
        422
      );
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

export const getPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const getPost = await Post.findById(postId);
    if (!getPost) {
      const error = new HttpError('Could not find post.', 404);
      throw error;
    }

    res.status(200).json({
      message: "Post fetched.",
      post: getPost,
    })
  } catch (err) {
    return next(new HttpError("Failed to fetch a post", 500));
  }
};
