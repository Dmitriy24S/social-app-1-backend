import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { register } from './controllers/auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'

// CONFIGURATION (middleware & package)
const __filename = fileURLToPath(import.meta.url) // This function ensures the correct decodings of percent-encoded characters as well as ensuring a cross-platform valid absolute path string.
const __dirname = path.dirname(__filename) // Return the directory name of a path. Similar to the Unix dirname command.
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common')) // Standard Apache common log output. :remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length]
app.use(bodyParser.json({ limit: '30mb', extended: true })) // Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true })) // Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))) // set directory where keep assets(images) localy in this case, in real production cloud storage or file directory

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
}) // save file to destination folder
const upload = multer({ storage }) // anytime need to use upload file - use this variable

// ROUTES WITH FILES (auth)
app.post('/auth/register', upload.single('picture'), register) // not in routes/auth.js for access to upload multer func.

// ROUTES
app.use('/auth', authRoutes)
app.use('/users', userRoutes)

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
  })
  .catch((error) => console.log(`${error} did not connect`))