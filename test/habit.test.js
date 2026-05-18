import assert from 'assert'

// Test that a habit object has the required fields.
const habit = {
  name: 'Exercise',
  frequency: 'daily',
  completedDates: []
}

assert.strictEqual(habit.name, 'Exercise')
assert.strictEqual(habit.frequency, 'daily')

const todayKey = '2026-05-18'

habit.completedDates.push(todayKey)

assert.strictEqual(
  habit.completedDates.includes(todayKey),
  true
)
console.log('All tests passed!')
