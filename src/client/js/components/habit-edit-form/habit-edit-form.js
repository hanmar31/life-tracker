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

    const form = document.createElement('form')

    const input = document.createElement('input')
    input.value = this._habit.name
    this.input = input

    const select = document.createElement('select')
    const options = ['daily', 'weekly', 'monthly', 'specific']
    options.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value === 'specific' ? 'specific days' : value
      if (value === this._habit.frequency) {
        option.selected = true
      }
      select.appendChild(option)
    })
    this.select = select

    const daysContainer = document.createElement('div')
    daysContainer.classList.add('days-selector')

    daysContainer.style.display = this._habit.frequency === 'specific' ? 'flex' : 'none'
    this.daysContainer = daysContainer

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const savedDays = this._habit.selectedDays || []

    weekdays.forEach(day => {
      const label = document.createElement('label')
      const checkboxInput = document.createElement('input')
      checkboxInput.type = 'checkbox'
      checkboxInput.value = day

      if (savedDays.includes(day)) {
        checkboxInput.checked = true
      }

      label.append(checkboxInput, `${day}`)
      daysContainer.appendChild(label)
    })

    select.addEventListener('change', () => {
      if (select.value === 'specific') {
        daysContainer.style.display = 'flex'
      } else {
        daysContainer.style.display = 'none'
      }
    })

    const saveBtn = document.createElement('button')
    saveBtn.type = 'submit'
    saveBtn.textContent = 'Save'

    const cancelBtn = document.createElement('button')
    cancelBtn.type = 'button'
    cancelBtn.textContent = 'Cancel'

    cancelBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('go-back', {
        bubbles: true,
        composed: true
      }))
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.updateHabit()
    })

    form.append(input, select, daysContainer, saveBtn, cancelBtn)
    wrapper.appendChild(form)
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

    const checkedBoxes = this.daysContainer.querySelectorAll('input:checked')
    const selectedDays = Array.from(checkedBoxes).map(cb => cb.value)

    this.dispatchEvent(new CustomEvent('update-habit', {
      detail: {
        id: this._habit._id,
        name,
        frequency,
        selectedDays
      },
      bubbles: true,
      composed: true
    }))
  }
}
customElements.define('habit-edit-form', HabitEditForm)
