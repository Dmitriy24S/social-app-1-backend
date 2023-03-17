// Authorization

import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  try {
    // grab token from frontend
    let token = req.header('Authorization')
    console.log('auth middleware token:', token)

    if (!token) {
      return res.status(403).send('Access Denied')
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()
    }

    // const verified = jwt.verify(token.process.env.JWT_SECRET)
    // const verified = jwt.verify(process.env.JWT_SECRET)
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    console.log('auth middleware verified:', verified)
    req.user = verified
    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('auth middleware catch error', error)
  }
}
