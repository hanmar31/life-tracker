/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import '../habit-list/index.js'
import '../habit-form/index.js'
import { loadCSS } from '../../utils/css-loader.js'

/**
 * Represents the main Habit App.
 */
class HabitApp extends HTMLElement {
  /**
   * Creates the component and attaches a shadoW DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.view = 'list'
    this.habits = []
    this.currentDate = new Date()
  }

  /**
   * Fetches habits from the API and updates the component state.
   */
  async loadHabits () {
    const res = await fetch('/api/habits')
    this.habits = await res.json()
  }

  /**
   * Called when the element is added to the DOM.
   */
  async connectedCallback () {
    const cssURL = new URL('./css/styles.css', import.meta.url).href
    const css = await loadCSS(cssURL)

    const style = document.createElement('style')
    style.textContent = css
    this.shadowRoot.appendChild(style)

    await this.loadHabits()

    this.render()
  }

  /**
   * Renders the habit app UI.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')

    const title = document.createElement('h1')
    title.textContent = 'Life Tracker'

    wrapper.appendChild(title)

    if (this.view === 'daily') {
      this.renderDailyView(wrapper)
    } else if (this.view === 'form') {
      this.renderFormView(wrapper)
    } else if (this.view === 'weekly') {
      this.renderWeeklyView(wrapper)
    } else if (this.view === 'monthly') {
      this.renderMonthlyView(wrapper)
    } else {
      this.renderListView(wrapper)
    }
    shadow.appendChild(wrapper)
  }

  /**
   * Creates navigation buttons for switching views.
   *
   * @param {HTMLElement} wrapper - The container element.
   */
  renderNavButtons (wrapper) {
    const dailyBtn = document.createElement('button')
    dailyBtn.textContent = 'Today'

    dailyBtn.addEventListener('click', () => {
      this.view = 'daily'
      this.render()
    })

    const weekBtn = document.createElement('button')
    weekBtn.textContent = 'This week'

    weekBtn.addEventListener('click', () => {
      this.view = 'weekly'
      this.render()
    })

    const monthBtn = document.createElement('button')
    monthBtn.textContent = 'This month'

    monthBtn.addEventListener('click', () => {
      this.view = 'monthly'
      this.render()
    })

    const navBtns = document.createElement('div')
    navBtns.classList.add('nav-buttons')
    navBtns.append(dailyBtn, weekBtn, monthBtn)

    const createBtn = document.createElement('button')
    createBtn.textContent = 'Create Habit'

    createBtn.addEventListener('click', () => {
      this.view = 'form'
      this.render()
    })

    const create = document.createElement('div')
    create.classList.add('create-button')
    create.appendChild(createBtn)

    wrapper.append(navBtns, create)
  }

  /**
   * Handles toggling a habit.
   *
   * @param {CustomEvent} e - Toggle event.
   */
  handleToggleHabit (e) {
    const habit = this.habits.find(h => h.id === e.detail.id)

    if (habit) {
      habit.completed = !habit.completed

      const habitList = this.shadowRoot.querySelector('habit-list')
      const item = habitList.shadowRoot.querySelector(`habit-item[data-id="${e.detail.id}"]`)
      if (item) {
        item.dataset.completed = habit.completed
        item.render()
      }
    }
  }

  /**
   * Handles deleting a habit.
   *
   * @param {CustomEvent} e - Delete habit.
   */
  async handleDeleteHabit (e) {
    await fetch(`/api/habits/${e.detail.id}`, {
      method: 'DELETE'
    })

    this.habits = this.habits.filter(h => h.id !== e.detail.id)
    this.render()
  }

  /**
   * Renders a daily view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderDailyView (wrapper) {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.toLocaleDateString('en', { month: 'long' })
    const day = String(this.currentDate.getDate()).padStart(2, '0')

    const dayDate = `${day} ${month} ${year}`

    const date = document.createElement('p')
    date.textContent = dayDate

    const dateDiv = document.createElement('div')
    dateDiv.classList.add('current-date')
    dateDiv.appendChild(date)

    const weekdayName = this.currentDate.toLocaleDateString('en', { weekday: 'long' })

    const dayName = document.createElement('p')
    dayName.textContent = weekdayName

    const dayNameDiv = document.createElement('div')
    dayNameDiv.classList.add('current-day-name')
    dayNameDiv.appendChild(dayName)

    const dailyList = document.createElement('habit-list')
    dailyList.habits = this.habits.filter(habit => habit.frequency === 'daily')

    dailyList.addEventListener('toggle-habit', (e) => this.handleToggleHabit(e))

    dailyList.addEventListener('delete-habit', async (e) => {
      await this.handleDeleteHabit(e)
    })

    wrapper.append(dateDiv, dayNameDiv)
    this.renderNavButtons(wrapper)
    wrapper.appendChild(dailyList)
  }

  /**
   * Renders a weekly view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderWeeklyView (wrapper) {
    const daysOfWeek = this.currentDate.getDay()
    const daysFromMonday = (daysOfWeek + 6) % 7

    const monday = new Date(this.currentDate)
    monday.setDate(this.currentDate.getDate() - daysFromMonday)

    const sunday = new Date(this.currentDate)
    sunday.setDate(this.currentDate.getDate() - daysFromMonday + 6)

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
    wrapper.appendChild(dateDiv)

    this.renderNavButtons(wrapper)

    const weekList = document.createElement('habit-list')
    weekList.habits = this.habits.filter(habit => habit.frequency === 'weekly')
    weekList.addEventListener('toggle-habit', (e) => this.handleToggleHabit(e))

    weekList.addEventListener('delete-habit', async (e) => {
      await this.handleDeleteHabit(e)
    })

    wrapper.appendChild(weekList)
  }

  /**
   * Renders a monthly view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderMonthlyView (wrapper) {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.toLocaleDateString('en', { month: 'long' })

    const monthName = `${month} ${year}`

    const monthDate = document.createElement('p')
    monthDate.textContent = monthName

    const monthDiv = document.createElement('div')
    monthDiv.classList.add('current-month-name')
    monthDiv.appendChild(monthDate)

    wrapper.appendChild(monthDiv)
    this.renderNavButtons(wrapper)

    const monthList = document.createElement('habit-list')
    monthList.habits = this.habits.filter(habit => habit.frequency === 'monthly')
    monthList.addEventListener('toggle-habit', (e) => this.handleToggleHabit(e))

    monthList.addEventListener('delete-habit', async (e) => {
      await this.handleDeleteHabit(e)
    })

    wrapper.appendChild(monthList)
  }

  /**
   * Renders the habit list view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root
   */
  renderListView (wrapper) {
    this.renderNavButtons(wrapper)

    const list = document.createElement('habit-list')
    list.habits = this.habits

    wrapper.appendChild(list)
  }

  /**
   * Renders the create habit form.
   *
   * @param {ShadowRoot} wrapper the component's shadow root
   */
  renderFormView (wrapper) {
    const form = document.createElement('habit-form')

    form.addEventListener('create-habit', async (e) => {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: e.detail.name,
          frequency: e.detail.frequency
        })
      })

      const createdHabit = await res.json()

      this.habits.push(createdHabit)

      this.view = 'daily'
      this.render()
    })

    form.addEventListener('go-back', () => {
      this.view = 'daily'
      this.render()
    })

    wrapper.appendChild(form)
  }
}

customElements.define('habit-app', HabitApp)
