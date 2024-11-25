import express from "express";
import { getPosts, createPost } from "../controllers/feed";
import { createPostsValidationRules } from "../validators/createPostsValidation";

const router = express.Router();

// GET => /feed/posts
router.get("/posts", getPosts);

// POST => /feed/post
router.post("/post", createPostsValidationRules(), createPost);

export default router;