/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import '../habit-list/index.js'
import '../habit-form/index.js'

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
    await this.loadHabits()
    this.render()
  }

  /**
   * Renders the habit app UI.
   */
  render () {
    const shadow = this.shadowRoot

    shadow.replaceChildren()

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = new URL('./css/styles.css', import.meta.url)
    shadow.appendChild(style)

    const title = document.createElement('h1')
    title.textContent = 'Life Tracker'

    shadow.append(style, title)

    if (this.view === 'list') {
      this.renderListView(shadow)
    } else {
      this.renderFormView(shadow)
    }
  }

  /**
   * Renders the habit list view.
   *
   * @param {ShadowRoot} shadow the component's shadow root
   */
  renderListView (shadow) {
    const button = document.createElement('button')
    button.textContent = 'Create Habit'

    button.addEventListener('click', () => {
      this.view = 'form'
      this.render()
    })

    const list = document.createElement('habit-list')
    list.habits = this.habits

    list.addEventListener('toggle-habit', (e) => {
      const habit = this.habits.find(h => h.id === e.detail.id)

      if (habit) {
        habit.completed = !habit.completed
        this.render()
      }
    })

    shadow.append(button, list)
  }

  /**
   * Renders the create habit form.
   *
   * @param {ShadowRoot} shadow the component's shadow root
   */
  renderFormView (shadow) {
    const form = document.createElement('habit-form')

    form.addEventListener('create-habit', async (e) => {
      fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: e.detail.name,
          frequency: e.detail.frequency
        })
      })

      await this.loadHabits()

      this.view = 'list'
      this.render()
    })

    form.addEventListener('go-back', () => {
      this.view = 'list'
      this.render()
    })

    shadow.appendChild(form)
  }
}

customElements.define('habit-app', HabitApp)
