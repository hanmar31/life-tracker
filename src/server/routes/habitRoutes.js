import express from 'express'
import {
  getHabits,
  createHabit,
  deleteHabit
} from '../controllers/habitController.js'

const router = express.Router()

router.get('/v1/habits', getHabits)

router.post('/v1/habits', createHabit)

router.delete('/v1/habits/:id', deleteHabit)

export default router
