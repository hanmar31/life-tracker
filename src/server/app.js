/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import habitRoutes from './routes/habitRoutes.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use(express.static(path.join(__dirname, './../client')))

app.use('/api', habitRoutes)

export default app
