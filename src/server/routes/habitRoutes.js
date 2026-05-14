import express from 'express'
import {
  getHabits,
  createHabit,
  deleteHabit,
  editHabit,
  toggleHabit
} from '../controllers/habitController.js'

const router = express.Router()

router.get('/v1/habits', getHabits)

router.post('/v1/habits', createHabit)

router.put('/v1/habits/:id', editHabit)

router.patch('/v1/habits/:id/toggle', toggleHabit)

router.delete('/v1/habits/:id', deleteHabit)

export default router
