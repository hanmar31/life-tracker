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

    if (this.view === 'list') {
      this.renderListView(wrapper)
    } else {
      this.renderFormView(wrapper)
    }

    shadow.appendChild(wrapper)
  }

  /**
   * Renders the habit list view.
   *
   * @param {ShadowRoot} wrapper the component's shadow root
   */
  renderListView (wrapper) {
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

        const habitList = this.shadowRoot.querySelector('habit-list')
        const item = habitList.shadowRoot.querySelector(`habit-item[data-id="${e.detail.id}"]`)
        if (item) {
          item.dataset.completed = habit.completed
          item.render()
        }
      }
    })

    wrapper.append(button, list)
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

      this.view = 'list'
      this.render()
    })

    form.addEventListener('go-back', () => {
      this.view = 'list'
      this.render()
    })

    wrapper.appendChild(form)
  }
}

customElements.define('habit-app', HabitApp)
