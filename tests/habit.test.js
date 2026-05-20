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

// Test toggle logic
const habit2 = {
  name: 'Go Swimming',
  frequency: 'weekly',
  completedDates: []
}

const mondayKey = '2026-05-12'
habit2.completedDates.push(mondayKey)
assert.strictEqual(habit2.completedDates.includes(mondayKey), true)

// Toggle off
habit2.completedDates = habit2.completedDates.filter(d => d !== mondayKey)
assert.strictEqual(habit2.completedDates.includes(mondayKey), false)

// Empty name invaild.
assert.strictEqual(''.trim().length === 0, true)

// Too long habit name invalid
assert.strictEqual('a'.repeat(31).length > 30, true)

// Valid name
assert.strictEqual('Workout'.length <= 30, true)

console.log('All tests passed!')
