import express from 'express'
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// READ
router.get('/', verifyToken, getFeedPosts) // in real production: curated and ai algo, etc
router.get('/:userId/posts', verifyToken, getUserPosts)

// UPDATE
router.patch('/:id/like', verifyToken, likePost)

export default router
