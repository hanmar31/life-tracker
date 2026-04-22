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

    this.habits = [
      { id: 1, name: 'Study' },
      { id: 2, name: 'Drink water' }
    ]
    this.view = 'list'
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
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

  renderListView (shadow) {
    const button = document.createElement('button')
    button.textContent = 'Create Habit'

    button.addEventListener('click', () => {
      this.view = 'form'
      this.render()
    })

    const list = document.createElement('habit-list')
    list.habits = this.habits

    shadow.append(button, list)
  }

  renderFormView (shadow) {
    const form = document.createElement('habit-form')

    form.addEventListener('create-habit', (e) => {
      const newHabit = {
        id: Date.now(),
        name: e.detail.name,
        frequency: e.detail.frequency
      }

      this.habits.push(newHabit)

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
