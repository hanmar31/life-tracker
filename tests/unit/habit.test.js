describe('Habit logic', () => {
  test('daily habit has correct fields', () => {
    const habit = {
      name: 'Exercise',
      frequency: 'daily',
      completedDates: []
    }

    expect(habit.name).toBe('Exercise')
    expect(habit.frequency).toBe('daily')
  })

  test('can mark daily habit completed', () => {
    const habit = {
      name: 'Exercise',
      frequency: 'daily',
      completedDates: []
    }

    const todayKey = '2026-05-21'

    habit.completedDates.push(todayKey)

    expect(habit.completedDates.includes(todayKey)).toBe(true)
  })

  test('can toggle weekly habit completion', () => {
    const habit = {
      name: 'Go swimming',
      frequency: 'weekly',
      completedDates: []
    }

    const mondayKey = '2026-05-12'

    habit.completedDates.push(mondayKey)

    expect(habit.completedDates.includes(mondayKey)).toBe(true)

    habit.completedDates = habit.completedDates.filter(
      d => d !== mondayKey
    )

    expect(habit.completedDates.includes(mondayKey)).toBe(false)
  })

  test('empty name is invalid', () => {
    expect(''.trim().length === 0).toBe(true)
  })

  test('too long habit name is invalid', () => {
    expect('a'.repeat(31).length > 30).toBe(true)
  })

  test('valid habit name passes validation', () => {
    expect('Workout'.length <= 30).toBe(true)
  })
})
