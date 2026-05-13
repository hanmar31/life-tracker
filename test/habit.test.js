import assert from 'assert'

// Test that a habit object has the required fields.
const habit = {
  name: 'Exercise',
  frequency: 'daily',
  completed: false
}

assert.strictEqual(habit.name, 'Exercise')
assert.strictEqual(habit.frequency, 'daily')
assert.strictEqual(habit.completed, false)

console.log('All tests passed!')
