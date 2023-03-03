import express from 'express'
import { addRemoveFriend, getUser, getUserFriends } from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// READ ROUTES
router.get('/:id', verifyToken, getUser) // .../users/:id
router.get('/:id/friends', verifyToken, getUserFriends)

// UPDATE ROUTES
router.patch('/:id/:friendId', verifyToken, addRemoveFriend) // friend id of who we want to add/remove (more like facebook, less twitter friend logic?)

export default router
