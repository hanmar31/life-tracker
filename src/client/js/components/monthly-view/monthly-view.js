/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'
import '../habit-list/index.js'

/**
 * Displays the daily view.
 */
class MonthlyView extends HTMLElement {
  /**
   * Creates the component and attaches a shadoW DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._habits = []
    this._ready = false
    this._currentDate = new Date()
  }

  /**
   * Called when the element is connected to the DOM.
   */
  async connectedCallback () {
    const cssUrl = new URL('./css/styles.css', import.meta.url).href
    const css = await loadCSS(cssUrl)

    const style = document.createElement('style')
    style.textContent = css
    this.shadowRoot.appendChild(style)

    this._ready = true
    this.render()
  }

  /**
   * Sets the habit data and re-renders the list.
   */
  set habits (value) {
    this._habits = value
    if (this._ready) this.render()
  }

  /**
   * Gets the habit data.
   *
   * @returns {Array} habit data.
   */
  get habits () {
    return this._habits
  }

  /**
   * Sets the current date.
   */
  set currentDate (value) {
    this._currentDate = value
    if (this._ready) this.render()
  }

  /**
   * Gets the current date.
   *
   * @returns {Date} The current date.
   */
  get currentDate () {
    return this._currentDate
  }

  /**
   * Renders the monthly view.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('monthly-wrapper')

    const year = this._currentDate.getFullYear()
    const month = this._currentDate.toLocaleDateString('en', { month: 'long' })

    const monthName = `${month} ${year}`

    const monthDate = document.createElement('p')
    monthDate.textContent = monthName

    const monthDiv = document.createElement('div')
    monthDiv.classList.add('current-month-name')
    monthDiv.appendChild(monthDate)

    const prevBtn = document.createElement('button')
    prevBtn.classList.add('prev-button')
    prevBtn.textContent = '<-- Previous month'

    const nextBtn = document.createElement('button')
    nextBtn.classList.add('next-button')
    nextBtn.textContent = 'Next month -->'

    const changeDateDiv = document.createElement('div')
    changeDateDiv.classList.add('monthly-change-date')
    changeDateDiv.append(prevBtn, monthDiv, nextBtn)

    wrapper.appendChild(changeDateDiv)

    const monthList = document.createElement('habit-list')
    const monthKey = `${year}-${String(this._currentDate.getMonth() + 1).padStart(2, '0')}`

    monthList.habits = this._habits
      .filter(habit => habit.frequency === 'monthly')
      .map(habit => ({
        ...habit,
        completed: habit.completedDates.includes(monthKey)
      }))

    monthList.addEventListener('toggle-habit', (e) => {
      this.dispatchEvent(new CustomEvent('toggle-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    monthList.addEventListener('edit-habit', (e) => {
      this.dispatchEvent(new CustomEvent('edit-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    monthList.addEventListener('delete-habit', (e) => {
      this.dispatchEvent(new CustomEvent('delete-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    prevBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('change-date', {
        detail: { direction: 'prev' },
        bubbles: true
      }))
    })

    nextBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('change-date', {
        detail: { direction: 'next' },
        bubbles: true
      }))
    })

    const monthNumber = this._currentDate.getMonth()
    const daysInMonth = new Date(year, monthNumber + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, monthNumber, 1).getDay()
    const firstDayOfWeek = (firstDayOfMonth + 6) % 7

    const calendarGrid = document.createElement('div')
    calendarGrid.classList.add('calendar-grid')

    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    dayHeaders.forEach(day => {
      const header = document.createElement('div')
      header.classList.add('calendar-header')
      header.textContent = day
      calendarGrid.appendChild(header)
    })

    const weekRows = []
    let currentWeekCells = []
    let columnIndex = firstDayOfWeek

    for (let i = 0; i < firstDayOfWeek; i++) {
      const empty = document.createElement('div')
      empty.classList.add('calendar-day', 'empty-day')
      calendarGrid.appendChild(empty)
      currentWeekCells.push(empty)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div')
      cell.classList.add('calendar-day')

      const dayKey = `${year}-${String(monthNumber + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

      const loopDate = new Date(year, monthNumber, day)
      const loopWeekdayName = loopDate.toLocaleDateString('en', { weekday: 'long' })

      const activeHabitsForDay = this._habits.filter(h => {
        if (h.frequency === 'daily') return true
        if (h.frequency === 'specific') {
          return h.selectedDays && h.selectedDays.includes(loopWeekdayName)
        }
        return false
      })
      const completedCount = activeHabitsForDay.filter(h => h.completedDates.includes(dayKey)).length
      const totalCount = activeHabitsForDay.length

      const dayNumber = document.createElement('span')
      dayNumber.textContent = day
      dayNumber.classList.add('day-number')

      const ratio = document.createElement('span')
      ratio.textContent = totalCount > 0 ? `${completedCount}/${totalCount} completed` : ''
      ratio.classList.add('day-ratio')

      cell.append(dayNumber, ratio)

      cell.addEventListener('click', () => {
        const clickedDate = new Date(year, monthNumber, day)
        this.dispatchEvent(new CustomEvent('navigate-to-date', {
          detail: { date: clickedDate },
          bubbles: true
        }))
      })
      calendarGrid.appendChild(cell)
      currentWeekCells.push(cell)
      columnIndex++

      if (columnIndex % 7 === 0) {
        weekRows.push([...currentWeekCells])
        currentWeekCells = []
      }
    }

    if (currentWeekCells.length > 0) {
      weekRows.push([...currentWeekCells])
    }

    const lastRowCells = weekRows[weekRows.length - 1]
    const remaningCells = 7 - lastRowCells.length
    for (let i = 0; i < remaningCells; i++) {
      const empty = document.createElement('div')
      empty.classList.add('calendar-day', 'empty-day')
      calendarGrid.appendChild(empty)
      lastRowCells.push(empty)
    }

    const weekColumn = document.createElement('div')
    weekColumn.classList.add('week-column')

    const weekColumnHeader = document.createElement('div')
    weekColumnHeader.classList.add('week-column-header')
    weekColumnHeader.textContent = 'Weekly Habits'
    weekColumn.appendChild(weekColumnHeader)

    const weeklyHabits = this._habits.filter(h => h.frequency === 'weekly')

    weekRows.forEach((rowCell, rowIndex) => {
      const weekCell = document.createElement('div')
      weekCell.classList.add('week-cell')

      const monday = new Date(year, monthNumber, 1 - firstDayOfWeek + (rowIndex * 7))

      const mondayKey = [
        monday.getFullYear(),
        String(monday.getMonth() + 1).padStart(2, '0'),
        String(monday.getDate()).padStart(2, '0')
      ].join('-')

      const completed = weeklyHabits.filter(h => h.completedDates.includes(mondayKey)).length
      const total = weeklyHabits.length

      weekCell.textContent = total > 0 ? `${completed}/${total} completed` : '-'

      weekCell.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('navigate-to-week', {
          detail: { date: monday },
          bubbles: true
        }))
      })
      weekCell.addEventListener('mouseenter', () => {
        rowCell.forEach(cell => cell.classList.add('week-row-highlight'))
      })

      weekCell.addEventListener('mouseleave', () => {
        rowCell.forEach(cell => cell.classList.remove('week-row-highlight'))
        weekCell.classList.remove('week-row-highlight')
      })

      weekColumn.appendChild(weekCell)
    })

    const sidePanel = document.createElement('div')
    sidePanel.classList.add('monthly-side-panel')

    const sidePanelTitle = document.createElement('h3')
    sidePanelTitle.classList.add('monthly-side-panel-title')
    sidePanel.textContent = 'Monthly Habits'

    sidePanel.append(sidePanelTitle, monthList)

    const contentDiv = document.createElement('div')
    contentDiv.classList.add('monthly-content')
    contentDiv.append(calendarGrid, weekColumn, sidePanel)

    wrapper.appendChild(contentDiv)
    shadow.appendChild(wrapper)
  }
}
customElements.define('monthly-view', MonthlyView)
