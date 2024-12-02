import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/post";
import path from "node:path";
import fs from "node:fs/promises";

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
    const currentPage: any = req.query.page || 1;
    const perPage = 2;

    let totalItems;
    const count = await Post.find().countDocuments();
    if (count) {
      totalItems = count;

      const posts = await Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (posts) {
        res.status(200).json({
          message: "Fetched posts successfully.",
          posts: posts,
          totalItems: totalItems,
        });
      }
    }
  } catch (err) {
    return next(new HttpError("Failed to fetch posts.", 500));
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

    if (!req.file) {
      const validationError = new HttpError("No Image provided", 422);
      res.status(validationError.statusCode).json({
        message: validationError.message,
      });
      return;
    }

    const imageUrl = req.file.path;
    const { title, content } = req.body;

    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
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
      const error = new HttpError("Could not find post.", 404);
      throw error;
    }

    res.status(200).json({
      message: "Post fetched.",
      post: getPost,
    });
  } catch (err) {
    return next(new HttpError("Failed to fetch a post", 500));
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
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
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new HttpError("No file picked", 422);
      throw error;
    }

    // Valid data so upload to db
    const fetchedPost = await Post.findById(postId);
    if (!fetchedPost) {
      const error = new HttpError("Could not find post.", 404);
      throw error;
    }

    if (imageUrl !== fetchedPost.imageUrl) {
      clearImage(fetchedPost.imageUrl);
    }
    fetchedPost.title = title;
    fetchedPost.imageUrl = imageUrl;
    fetchedPost.content = content;

    const result = await fetchedPost.save();

    res.status(200).json({
      message: "Post updated!",
      post: result,
    });
  } catch (err) {
    return next(new HttpError("Failed to update a post", 500));
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const fetchedPost = await Post.findById(postId);
    if (!fetchedPost) {
      const error = new HttpError("Could not find post.", 404);
      throw error;
    }
    clearImage(fetchedPost.imageUrl);

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Deleted post!" });
  } catch (err) {
    return next(new HttpError("Failed to delete a post", 500));
  }
};

// This is a helper function to remove the unused files.
const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "..", filePath);
  // console.log(filePath);
  fs.unlink(filePath);
};
