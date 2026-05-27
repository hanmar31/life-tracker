/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'

/**
 * Provides a form to create new habits.
 */
class HabitForm extends HTMLElement {
  /**
   * Creates the component and attaches a shadoW DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
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
   * Renders the form UI.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')

    const form = document.createElement('form')

    const input = document.createElement('input')
    input.placeholder = 'New habit..'
    this.input = input

    const select = document.createElement('select')

    const options = ['daily', 'weekly', 'monthly']
    options.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      select.appendChild(option)
    })
    const specificOption = document.createElement('option')
    specificOption.value = 'specific'
    specificOption.textContent = 'specific days'
    select.appendChild(specificOption)

    this.select = select

    const daysContainer = document.createElement('div')
    daysContainer.style.display = 'none'
    daysContainer.classList.add('days-selector')
    this.daysContainer = daysContainer

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    weekdays.forEach(day => {
      const label = document.createElement('label')
      const checkboxInput = document.createElement('input')
      checkboxInput.type = 'checkbox'
      checkboxInput.value = day

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

    const button = document.createElement('button')
    button.type = 'submit'
    button.textContent = 'Add'

    const backBtn = document.createElement('button')
    backBtn.type = 'button'
    backBtn.textContent = 'Back'

    backBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('go-back', {
        bubbles: true,
        composed: true
      }))
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.createHabit()
    })

    form.append(input, select, daysContainer, button, backBtn)
    wrapper.appendChild(form)
    shadow.appendChild(wrapper)
  }

  /**
   * Creates a new habit.
   *
   * @returns {void}
   */
  createHabit () {
    const name = this.input.value.trim()
    const frequency = this.select.value
    const existing = this.shadowRoot.querySelector('.error')
    if (existing) existing.remove()

    if (!name) {
      const errMessage = document.createElement('p')
      errMessage.textContent = 'Habit name cannot be empty'
      errMessage.classList.add('error')
      this.shadowRoot.appendChild(errMessage)
      return errMessage
    }

    if (name.length > 30) {
      const errMessage = document.createElement('p')
      errMessage.textContent = 'Habit name cannot be longer than 30 characters'
      errMessage.classList.add('error')
      this.shadowRoot.appendChild(errMessage)
      return errMessage
    }

    const checkedBoxes = this.daysContainer.querySelectorAll('input:checked')
    const selectedDays = Array.from(checkedBoxes).map(cb => cb.value)

    this.dispatchEvent(new CustomEvent('create-habit', {
      detail: { name, frequency, selectedDays },
      bubbles: true,
      composed: true
    }))

    this.input.value = ''

    const allBoxes = this.daysContainer.querySelectorAll('input')
    allBoxes.forEach(cb => { cb.checked = false })
    this.daysContainer.style.display = 'none'
  }
}

customElements.define('habit-form', HabitForm)
