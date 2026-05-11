/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

const habits = []

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use(express.static(path.join(__dirname, './../client')))

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' })
})

app.get('/api/habits', (req, res) => {
  res.json(habits)
})

app.post('/api/habits', (req, res) => {
  const { name, frequency } = req.body

  const newHabit = {
    id: Date.now(),
    name,
    frequency,
    completed: false
  }
  habits.push(newHabit)

  res.status(201).json(newHabit)
})

app.delete('/api/habits/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = habits.findIndex(h => h.id === id)
  if (index !== -1) {
    habits.splice(index, 1)
    res.status(200).json({ message: 'Habit deleted' })
  } else {
    res.status(404).json({ message: 'Habit not found' })
  }
})

export default app
