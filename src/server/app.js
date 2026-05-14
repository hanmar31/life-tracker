/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import path from 'path'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { fileURLToPath } from 'url'
import habitRoutes from './routes/habitRoutes.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api', limiter)

app.use(express.json())

app.use(mongoSanitize())

app.use(express.static(path.join(__dirname, './../client')))

app.use('/api', habitRoutes)

export default app
