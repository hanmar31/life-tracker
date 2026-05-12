/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'
import '../habit-item/index.js'

/**
 * Displays a list of habits.
 */
class HabitList extends HTMLElement {
  /**
   * Creates the component and attaches a shadoW DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._habits = []
    this._ready = false
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
   * Renders the list of habits.
   *
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')

    const ul = document.createElement('ul')

    this._habits.forEach(habit => {
      const item = document.createElement('habit-item')

      item.dataset.id = habit._id
      item.dataset.name = habit.name
      item.dataset.frequency = habit.frequency
      item.dataset.completed = habit.completed

      item.addEventListener('toggle-habit', (e) => {
        this.dispatchEvent(new CustomEvent('toggle-habit', {
          detail: e.detail,
          bubbles: true
        }))
      })

      item.addEventListener('delete-habit', (e) => {
        this.dispatchEvent(new CustomEvent('delete-habit', {
          detail: e.detail,
          bubbles: true
        }))
      })

      ul.appendChild(item)
    })

    wrapper.appendChild(ul)
    shadow.appendChild(wrapper)
  }
}

customElements.define('habit-list', HabitList)
