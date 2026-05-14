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
 * Sanitizes a habit name by removing HTML tags.
 *
 * @param {string} name - the habit name.
 * @returns {string} the sanitized name.
 */
const sanitizeName = (name) => name.replace(/<[^>]*>/g, '').trim()

/**
 * Validates the habit before creating or updating.
 *
 * @param {string} name - the habit name.
 * @param {string} frequency - the habit frequency.
 * @returns {string|null} Validation error message or null if valid.
 */
const validateHabit = (name, frequency) => {
  const validFrequencies = ['daily', 'weekly', 'monthly']

  const cleanName = sanitizeName(name)

  if (!cleanName || !cleanName.trim()) {
    return 'Habit name cannot be empty'
  }
  if (cleanName.length > 30) {
    return 'Habit name is too long'
  }
  if (!validFrequencies.includes(frequency)) {
    return 'Frequency must be daily, weekly, or monthly'
  }
  return null
}
/**
 * Creates a new habit.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
export const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body
    const cleanName = sanitizeName(name)

    const error = validateHabit(cleanName, frequency)
    if (error) return res.status(400).json({ message: error })

    const habit = new Habit({
      name: cleanName,
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
    const cleanName = sanitizeName(name)

    const error = validateHabit(cleanName, frequency)
    if (error) return res.status(400).json({ message: error })

    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { name: cleanName, frequency },
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
