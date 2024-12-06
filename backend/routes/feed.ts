import express from 'express';
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/feed';
import {
  createPostsValidationRules,
  updatePostsValidationRules,
} from '../validators/postRouteValidation';

const router = express.Router();

// GET => /feed/posts
router.get('/posts', getPosts);

// POST => /feed/post
router.post('/post', createPostsValidationRules(), createPost);

// GET => /post/:postId
router.get('/post/:postId', getPost);

// PUT => /post/:postId
router.put('/post/:postId', updatePostsValidationRules(), updatePost);

// DELETE => /post/:postId
router.delete('/post/:postId', deletePost);

export default router;
