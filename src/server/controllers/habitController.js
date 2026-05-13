import Habit from '../models/habit.js'

/**
 * Gets the habits.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find()
    res.json(habits)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch habits' })
  }
}

/**
 * Creates a new habit.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body

    const habit = new Habit({
      name,
      frequency
    })

    await habit.save()

    res.status(201).json(habit)
  } catch (error) {
    res.status(500).json({
      message: 'Could not create habit'
    })
  }
}

/**
 * Edits a habit.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
export const editHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { name, frequency },
      { new: true }
    )

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' })
    }

    res.json(habit)
  } catch (error) {
    res.status(500).json({ message: 'Could not update habit.' })
  }
}

/**
 * Deletes a habit.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id)

    if (!habit) {
      return res.status(404).json({
        message: 'Habit not found'
      })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not delete habit'
    })
  }
}
