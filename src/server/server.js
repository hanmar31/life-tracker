/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { createServer } from 'http'
import app from './app.js'

const PORT = 3000

createServer(app).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
