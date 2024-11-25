import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/post";

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
      res.status(422).json({
        message: "Validation failed, entered data is incorrect.",
        errors: errors.array(),
      });
    }
  
    const { title, content } = req.body;
  
    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      imageUrl: 'images/googlepixel.png',
      creator: {
        name: "Abhianv",
      },
    });
  
    const result = await post.save();
  
    res.status(201).json({
      message: "Post created successfully.",
      post: result,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create a post.");
  }
  
};
