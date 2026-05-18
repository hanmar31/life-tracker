/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'
import '../habit-list/index.js'

/**
 * Displays the daily view.
 */
class WeeklyView extends HTMLElement {
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
   * Renders the weekly view.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')

    const daysOfWeek = this._currentDate.getDay()
    const daysFromMonday = (daysOfWeek + 6) % 7

    const monday = new Date(this._currentDate)
    monday.setDate(this._currentDate.getDate() - daysFromMonday)

    const sunday = new Date(this._currentDate)
    sunday.setDate(this._currentDate.getDate() - daysFromMonday + 6)

    const mondayDay = String(monday.getDate()).padStart(2, '0')
    const sundayDay = String(sunday.getDate()).padStart(2, '0')
    const mondayMonth = monday.toLocaleDateString('en', { month: 'long' })
    const sundayMonth = sunday.toLocaleDateString('en', { month: 'long' })
    const mondayYear = monday.getFullYear()
    const sundayYear = sunday.getFullYear()

    const yearDisplay = mondayYear === sundayYear ? mondayYear : `${mondayYear}-${sundayYear}`

    const monthDisplay = mondayMonth === sundayMonth ? mondayMonth : `${mondayMonth}-${sundayMonth}`

    const weekRange = `${mondayDay}-${sundayDay} ${monthDisplay} ${yearDisplay}`

    const date = document.createElement('p')
    date.textContent = weekRange

    const dateDiv = document.createElement('div')
    dateDiv.classList.add('current-date')
    dateDiv.appendChild(date)

    const prevBtn = document.createElement('button')
    prevBtn.classList.add('prev-button')
    prevBtn.textContent = '<-- Previous week'

    const nextBtn = document.createElement('button')
    nextBtn.classList.add('next-button')
    nextBtn.textContent = 'Next week -->'

    const changeDateDiv = document.createElement('div')
    changeDateDiv.classList.add('change-date')
    changeDateDiv.append(prevBtn, dateDiv, nextBtn)

    wrapper.appendChild(changeDateDiv)

    const weekDays = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)

      weekDays.push(day)
    }

    const daysContainer = document.createElement('div')
    daysContainer.classList.add('days-container')

    weekDays.forEach(day => {
      const weekCol = document.createElement('div')
      weekCol.classList.add('week-col')

      const weekdayName = day.toLocaleDateString('en', {
        weekday: 'short'
      })
      const dailyHabits = this._habits.filter(habit => habit.frequency === 'daily')
      const dailyHabitsList = document.createElement('ul')
      dailyHabitsList.classList.add('daily-habit-list')

      dailyHabits.forEach(habit => {
        const habitItem = document.createElement('li')
        const dayKey = [
          day.getFullYear(),
          String(day.getMonth() + 1).padStart(2, '0'),
          String(day.getDate()).padStart(2, '0')
        ].join('-')
        const isCompleted = habit.completedDates.includes(dayKey)
        habitItem.textContent = habit.name
        habitItem.classList.add('daily-habit-item')
        if (isCompleted) habitItem.classList.add('done')
        dailyHabitsList.appendChild(habitItem)
      })

      const weekday = document.createElement('p')
      weekday.textContent = weekdayName

      const date = document.createElement('p')
      date.textContent = day.getDate()

      weekCol.append(weekday, date, dailyHabitsList)

      daysContainer.appendChild(weekCol)

      weekCol.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('navigate-to-date', {
          detail: { date: day },
          bubbles: true
        }))
      })
      weekCol.style.cursor = 'pointer'
    })

    const sidePanel = document.createElement('div')
    sidePanel.classList.add('side-panel')

    const sidePanelTitle = document.createElement('h3')
    sidePanelTitle.textContent = 'Weekly Habits'
    sidePanelTitle.classList.add('side-panel-title')

    const weekList = document.createElement('habit-list')
    const mondayKey = [
      monday.getFullYear(),
      String(monday.getMonth() + 1).padStart(2, '0'),
      String(monday.getDate()).padStart(2, '0')
    ].join('-')

    weekList.habits = this._habits
      .filter(habit => habit.frequency === 'weekly')
      .map(habit => ({
        ...habit,
        completed: habit.completedDates.includes(mondayKey)
      }))

    weekList.addEventListener('toggle-habit', (e) => {
      this.dispatchEvent(new CustomEvent('toggle-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    weekList.addEventListener('edit-habit', (e) => {
      this.dispatchEvent(new CustomEvent('edit-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    weekList.addEventListener('delete-habit', (e) => {
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

    sidePanel.append(sidePanelTitle, weekList)
    const contentDiv = document.createElement('div')
    contentDiv.classList.add('content')
    contentDiv.append(daysContainer, sidePanel)
    wrapper.appendChild(contentDiv)
    shadow.appendChild(wrapper)
  }
}

customElements.define('weekly-view', WeeklyView)
