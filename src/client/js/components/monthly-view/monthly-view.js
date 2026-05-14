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
    wrapper.classList.add('wrapper')

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
    changeDateDiv.classList.add('change-date')
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

    wrapper.appendChild(monthList)
    shadow.appendChild(wrapper)
  }
}
customElements.define('monthly-view', MonthlyView)
