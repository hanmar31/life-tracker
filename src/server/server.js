import { createServer } from 'http'
import app from './app.js'

const PORT = 3000

createServer(app).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
