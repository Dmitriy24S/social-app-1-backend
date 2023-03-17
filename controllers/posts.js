import Post from '../models/Post.js'
import User from '../models/User.js'

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)
    console.log('createPost user', user)
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {
        // 'someid': true // ! Map instead of array of strings
      },
      comments: [],
    })
    await newPost.save()
    console.log('createPost newPost', newPost)

    const post = await Post.find().sort({ createdAt: 'desc' }) // grab all the posts, to show updated posts to newsfeed with new post // ! //
    res.status(201).json(post) // 201 created
  } catch (error) {
    res.status(409).json({ error: error.message })
    console.log('createPost error', error)
    // ! createPost error ReferenceError: User is not defined at createPost
  }
}

// READ
export const getFeedPosts = async (req, res) => {
  try {
    // const posts = await Post.find()
    const posts = await Post.find().sort({ createdAt: 'desc' }) // ! //
    res.status(200).json(posts) // 200 sucessful request
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    // const post = await Post.find({ userId }) // match posts with this userId
    const post = await Post.find({ userId }).sort({ createdAt: 'desc' }) // match posts with this userId // ! //
    res.status(200).json(post)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// UPDATE
export const likePost = async (req, res) => {
  try {
    console.log('like post controller, req.body', req.body)
    const { id } = req.params
    const { userId } = req.body // !
    const post = await Post.findById(id)
    const isLiked = post.likes.get(userId) // check if liked by that user, if exists // ! Map object

    if (isLiked) {
      post.likes.delete(userId)
    } else {
      // if does not exist set it
      post.likes.set(userId, true) // ! Map object
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    ) // update post, find it, and passing new likes, new = new object
    // By default, the findByIdAndUpdate method returns the original document before it was updated. This behavior can be modified by setting the new option to true. When new is set to true, the method will return the updated document instead of the original document.
    // By including the { new: true } option in the method call, we ensure that the updatedPost variable contains the updated document rather than the original document. This is useful if we need to perform additional operations on the updated document, or if we want to return the updated document as part of an HTTP response.

    res.status(200).json(updatedPost) // pass to frontend
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}
