/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'

/**
 * Provides a form to edit an existing habit.
 */
class HabitEditForm extends HTMLElement {
  /**
   * Creates the component and attaches a shadow DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._habit = null
  }

  /**
   * Sets the habit data to be edited and triggers a re-render.
   */
  set habit (value) {
    this._habit = value
    this.render()
  }

  /**
   * Gets the habit data.
   *
   * @returns {object} The habit object.
   */
  get habit () {
    return this._habit
  }

  /**
   * Called when the element is added to the DOM.
   */
  async connectedCallback () {
    const cssUrl = new URL('./css/styles.css', import.meta.url).href
    const css = await loadCSS(cssUrl)

    const style = document.createElement('style')
    style.textContent = css
    this.shadowRoot.appendChild(style)

    this.render()
  }

  /**
   * Renders the edit form UI.
   *
   * @returns {void}
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.edit-wrapper')
    if (old) old.remove()

    if (!this._habit) return

    const wrapper = document.createElement('div')
    wrapper.classList.add('edit-wrapper')

    const input = document.createElement('input')
    input.value = this._habit.name
    this.input = input

    const select = document.createElement('select')
    const options = ['daily', 'weekly', 'monthly']
    options.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      if (value === this._habit.frequency) {
        option.selected = true
      }
      select.appendChild(option)
    })
    this.select = select

    const saveBtn = document.createElement('button')
    saveBtn.textContent = 'Save'
    saveBtn.addEventListener('click', () => this.updateHabit())

    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = 'Cancel'

    cancelBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('go-back', {
        bubbles: true,
        composed: true
      }))
    })

    wrapper.append(input, select, saveBtn, cancelBtn)
    shadow.appendChild(wrapper)
  }

  /**
   * Validates input and dispatches an event to save the edited habit.
   *
   * @returns {void}
   */
  updateHabit () {
    const name = this.input.value.trim()
    const frequency = this.select.value

    const existing = this.shadowRoot.querySelector('.error')
    if (existing) existing.remove()

    if (!name) {
      const errMessage = document.createElement('p')
      errMessage.textContent = 'Habit name cannot be empty'
      errMessage.classList.add('error')
      this.shadowRoot.appendChild(errMessage)
      return
    }

    if (name.length > 30) {
      const errMessage = document.createElement('p')
      errMessage.textContent = 'Habit name cannot be longer than 30 characters'
      errMessage.classList.add('error')
      this.shadowRoot.appendChild(errMessage)
      return
    }

    this.dispatchEvent(new CustomEvent('update-habit', {
      detail: {
        id: this._habit._id,
        name,
        frequency
      },
      bubbles: true,
      composed: true
    }))
  }
}
customElements.define('habit-edit-form', HabitEditForm)
