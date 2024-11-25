import express from "express";
import { getPosts, createPost, getPost } from "../controllers/feed";
import { createPostsValidationRules } from "../validators/createPostsValidation";

const router = express.Router();

// GET => /feed/posts
router.get("/posts", getPosts);

// POST => /feed/post
router.post("/post", createPostsValidationRules(), createPost);

// GET => /post/:postId
router.get("/post/:postId", getPost);

export default router;