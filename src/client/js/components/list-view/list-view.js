/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import '../habit-list/index.js'
import { loadCSS } from '../../utils/css-loader.js'

/**
 * Represents the grouped List View for all habits.
 */
class Listview extends HTMLElement {
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
   * Renders the list view.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('list-wrapper')

    const dailyHabits = this._habits.filter(h => h.frequency === 'daily')
    const weeklyHabits = this._habits.filter(h => h.frequency === 'weekly')
    const monthlyHabits = this._habits.filter(h => h.frequency === 'monthly')

    const specificHabits = this._habits
      .filter(h => h.frequency === 'specific')
      .map(h => {
        const daysText = h.selectedDays && h.selectedDays.length > 0
          ? `(${h.selectedDays.join(', ')})`
          : ' (No days selected)'
        return {
          ...h,
          name: h.name + daysText
        }
      })

    this.renderCategory(wrapper, 'Daily Habits', dailyHabits)
    this.renderCategory(wrapper, 'Specific Days Habits', specificHabits)
    this.renderCategory(wrapper, 'Weekly Habits', weeklyHabits)
    this.renderCategory(wrapper, 'Monthly Habits', monthlyHabits)

    if (this._habits.length === 0) {
      const emptyMessage = document.createElement('p')
      emptyMessage.classList.add('empty-habit-list-text')
      emptyMessage.textContent = 'No habits created yet. Click "Create Habit" to get started!'
      wrapper.appendChild(emptyMessage)
    }

    shadow.appendChild(wrapper)
  }

  /**
   * Renders a specific habit category with a heading and a habit list.
   *
   * @param {HTMLElement} wrapper - The container element where the category will be appended.
   * @param {string} title - The title of the category heading (e.g., 'Daily Habits').
   * @param {Array<object>} habits - The filtered list of habit objects belonging to this category.
   * @returns {void}
   */
  renderCategory (wrapper, title, habits) {
    if (habits.length === 0) return

    const listHeading = document.createElement('h3')
    listHeading.classList.add('list-heading')
    listHeading.textContent = title

    const list = document.createElement('habit-list')
    list.habits = habits

    list.dataset.readonly = 'true'

    list.addEventListener('edit-habit', (e) => {
      this.dispatchEvent(new CustomEvent('edit-habit', {
        detail: e.detail,
        bubbles: true,
        composed: true
      }))
    })

    list.addEventListener('delete-habit', (e) => {
      this.dispatchEvent(new CustomEvent('delete-habit', {
        detail: e.detail,
        bubbles: true,
        composed: true
      }))
    })
    wrapper.append(listHeading, list)
  }
}

customElements.define('list-view', Listview)
