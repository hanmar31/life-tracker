import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  selectedDays: {
    type: [String],
    default: []
  },
  completedDates: {
    type: [String],
    default: []
  }
})

export default mongoose.model('Habit', habitSchema)
