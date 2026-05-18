/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import '../habit-list/index.js'
import '../habit-form/index.js'
import { loadCSS } from '../../utils/css-loader.js'
import '../daily-view/index.js'
import '../weekly-view/index.js'
import '../monthly-view/index.js'

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
    this.editingHabit = null
  }

  /**
   * Fetches habits from the API and updates the component state.
   */
  async loadHabits () {
    const res = await fetch('/api/v1/habits')
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

    if (this.view !== 'form') {
      this.renderNavButtons(wrapper)
    }

    if (this.view === 'daily') {
      this.renderDailyView(wrapper)
    } else if (this.view === 'form') {
      this.renderFormView(wrapper)
    } else if (this.view === 'weekly') {
      this.renderWeeklyView(wrapper)
    } else if (this.view === 'monthly') {
      this.renderMonthlyView(wrapper)
    } else if (this.view === 'edit') {
      this.renderEditView(wrapper)
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
      this.currentDate = new Date()
      this.view = 'daily'
      this.render()
    })

    const weekBtn = document.createElement('button')
    weekBtn.textContent = 'This week'

    weekBtn.addEventListener('click', () => {
      this.currentDate = new Date()
      this.view = 'weekly'
      this.render()
    })

    const monthBtn = document.createElement('button')
    monthBtn.textContent = 'This month'

    monthBtn.addEventListener('click', () => {
      this.currentDate = new Date()
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
  async handleToggleHabit (e) {
    const habit = this.habits.find(h => h._id === e.detail.id)
    if (!habit) return

    const current = new Date(this.currentDate)

    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')

    let periodKey

    if (habit.frequency === 'daily') {
      periodKey = [
        current.getFullYear(),
        String(current.getMonth() + 1).padStart(2, '0'),
        String(current.getDate()).padStart(2, '0')
      ].join('-')
    }
    if (habit.frequency === 'weekly') {
      const monday = new Date(current)
      const day = monday.getDay()
      const diff = day === 0 ? -6 : 1 - day

      monday.setDate(monday.getDate() + diff)

      periodKey = [
        monday.getFullYear(),
        String(monday.getMonth() + 1).padStart(2, '0'),
        String(monday.getDate()).padStart(2, '0')
      ].join('-')
    }
    if (habit.frequency === 'monthly') {
      periodKey = `${year}-${month}`
    }

    const res = await fetch(`/api/v1/habits/${habit._id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        periodKey
      })
    })

    const updatedHabit = await res.json()

    this.habits = this.habits.map(h =>
      h._id === updatedHabit._id ? updatedHabit : h
    )

    this.render()
  }

  /**
   * Handles editing a habit.
   *
   * @param {CustomEvent} e - Delete habit.
   */
  async handleEditHabit (e) {
    const habit = this.habits.find(h => h._id === e.detail.id)
    if (habit) {
      this.editingHabit = habit
      this.view = 'edit'
      this.render()
    }
  }

  /**
   * Handles deleting a habit.
   *
   * @param {CustomEvent} e - Delete habit.
   */
  async handleDeleteHabit (e) {
    await fetch(`/api/v1/habits/${e.detail.id}`, {
      method: 'DELETE'
    })

    this.habits = this.habits.filter(h => h._id !== e.detail.id)
    this.render()
  }

  /**
   * Renders a daily view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderDailyView (wrapper) {
    const dailyView = document.createElement('daily-view')
    dailyView.habits = this.habits
    dailyView.currentDate = this.currentDate

    dailyView.addEventListener('toggle-habit', (e) => {
      this.handleToggleHabit(e)
    })

    dailyView.addEventListener('edit-habit', async (e) => {
      await this.handleEditHabit(e)
    })

    dailyView.addEventListener('delete-habit', async (e) => {
      await this.handleDeleteHabit(e)
    })

    dailyView.addEventListener('change-date', (e) => {
      const newDate = new Date(this.currentDate)
      if (e.detail.direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1)
      } else {
        newDate.setDate(newDate.getDate() + 1)
      }
      this.currentDate = newDate
      this.render()
    })

    wrapper.appendChild(dailyView)
  }

  /**
   * Renders a weekly view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderWeeklyView (wrapper) {
    const weeklyView = document.createElement('weekly-view')
    weeklyView.habits = this.habits
    weeklyView.currentDate = this.currentDate

    weeklyView.addEventListener('toggle-habit', (e) => {
      this.handleToggleHabit(e)
    })

    weeklyView.addEventListener('edit-habit', async (e) => {
      await this.handleEditHabit(e)
    })

    weeklyView.addEventListener('delete-habit', async (e) => {
      await this.handleDeleteHabit(e)
    })

    weeklyView.addEventListener('change-date', (e) => {
      const newDate = new Date(this.currentDate)
      if (e.detail.direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() + 7)
      }
      this.currentDate = newDate
      this.render()
    })

    weeklyView.addEventListener('navigate-to-date', (e) => {
      this.currentDate = e.detail.date
      this.view = 'daily'
      this.render()
    })

    wrapper.appendChild(weeklyView)
  }

  /**
   * Renders a monthly view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderMonthlyView (wrapper) {
    const monthlyView = document.createElement('monthly-view')
    monthlyView.habits = this.habits
    monthlyView.currentDate = this.currentDate

    monthlyView.addEventListener('toggle-habit', (e) => {
      this.handleToggleHabit(e)
    })

    monthlyView.addEventListener('edit-habit', async (e) => {
      await this.handleEditHabit(e)
    })

    monthlyView.addEventListener('delete-habit', async (e) => {
      await this.handleDeleteHabit(e)
    })

    monthlyView.addEventListener('change-date', (e) => {
      const newDate = new Date(this.currentDate)
      if (e.detail.direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      this.currentDate = newDate
      this.render()
    })

    wrapper.appendChild(monthlyView)
  }

  /**
   * Renders the edit habit view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root.
   */
  renderEditView (wrapper) {
    const input = document.createElement('input')
    input.value = this.editingHabit.name

    const select = document.createElement('select')
    const options = ['daily', 'weekly', 'monthly']
    options.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      if (value === this.editingHabit.frequency) {
        option.selected = true
      }
      select.appendChild(option)
    })

    const saveBtn = document.createElement('button')
    saveBtn.textContent = 'Save'

    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = 'Cancel'

    cancelBtn.addEventListener('click', () => {
      this.editingHabit = null
      this.view = 'daily'
      this.render()
    })

    saveBtn.addEventListener('click', async (e) => {
      const name = input.value.trim()

      const existing = this.shadowRoot.querySelector('.error')
      if (existing) existing.remove()

      if (!name) {
        const errMessage = document.createElement('p')
        errMessage.textContent = 'Habit name cannot be empty'
        errMessage.classList.add('error')
        wrapper.appendChild(errMessage)
        return errMessage
      }

      if (name.length > 30) {
        const errMessage = document.createElement('p')
        errMessage.textContent = 'Habit name cannot be longer than 30 characters'
        errMessage.classList.add('error')
        wrapper.appendChild(errMessage)
        return errMessage
      }
      const res = await fetch(`/api/v1/habits/${this.editingHabit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: input.value,
          frequency: select.value
        })
      })
      const updatedHabit = await res.json()

      this.habits = this.habits.map(h => h._id === updatedHabit._id ? updatedHabit : h)
      this.editingHabit = null
      this.view = 'daily'
      this.render()
    })

    wrapper.append(input, select, saveBtn, cancelBtn)
  }

  /**
   * Renders the habit list view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root
   */
  renderListView (wrapper) {
    const list = document.createElement('habit-list')
    list.habits = this.habits

    list.addEventListener('edit-habit', async (e) => {
      await this.handleEditHabit(e)
    })

    const listContainer = document.createElement('div')
    listContainer.classList.add('list-container')
    listContainer.appendChild(list)

    wrapper.appendChild(listContainer)
  }

  /**
   * Renders the create habit form.
   *
   * @param {ShadowRoot} wrapper the component's shadow root
   */
  renderFormView (wrapper) {
    const form = document.createElement('habit-form')

    form.addEventListener('create-habit', async (e) => {
      const res = await fetch('/api/v1/habits', {
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
