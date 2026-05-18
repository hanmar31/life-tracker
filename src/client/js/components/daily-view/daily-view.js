/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'
import '../habit-list/index.js'

/**
 * Displays the daily view.
 */
class DailyView extends HTMLElement {
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
   * Renders the daily view.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')

    const year = this._currentDate.getFullYear()
    const month = this._currentDate.toLocaleDateString('en', { month: 'long' })
    const day = String(this._currentDate.getDate()).padStart(2, '0')

    const dayDate = `${day} ${month} ${year}`

    const date = document.createElement('p')
    date.textContent = dayDate

    const dateDiv = document.createElement('div')
    dateDiv.classList.add('current-date')
    dateDiv.appendChild(date)

    const weekdayName = this._currentDate.toLocaleDateString('en', { weekday: 'long' })

    const dayName = document.createElement('p')
    dayName.textContent = weekdayName

    const dayNameDiv = document.createElement('div')
    dayNameDiv.classList.add('current-day-name')
    dayNameDiv.appendChild(dayName)

    const prevBtn = document.createElement('button')
    prevBtn.classList.add('prev-button')
    prevBtn.textContent = '<-- Previous day'

    const nextBtn = document.createElement('button')
    nextBtn.classList.add('next-button')
    nextBtn.textContent = 'Next day -->'

    const changeDateDiv = document.createElement('div')
    changeDateDiv.classList.add('change-date')
    changeDateDiv.append(prevBtn, dateDiv, nextBtn)

    const dailyList = document.createElement('habit-list')
    const todayKey = [
      this._currentDate.getFullYear(),
      String(this._currentDate.getMonth() + 1).padStart(2, '0'),
      String(this._currentDate.getDate()).padStart(2, '0')
    ].join('-')

    const listContainer = document.createElement('div')
    listContainer.classList.add('list-container')
    listContainer.appendChild(dailyList)

    dailyList.habits = this._habits
      .filter(habit => habit.frequency === 'daily')
      .map(habit => ({
        ...habit,
        completed: habit.completedDates.includes(todayKey)
      }))

    dailyList.addEventListener('toggle-habit', (e) => {
      this.dispatchEvent(new CustomEvent('toggle-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    dailyList.addEventListener('edit-habit', (e) => {
      this.dispatchEvent(new CustomEvent('edit-habit', {
        detail: e.detail,
        bubbles: true
      }))
    })

    dailyList.addEventListener('delete-habit', (e) => {
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

    wrapper.append(changeDateDiv, dayNameDiv)
    wrapper.appendChild(listContainer)
    shadow.appendChild(wrapper)
  }
}
customElements.define('daily-view', DailyView)
