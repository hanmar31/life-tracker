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

    this.select = select

    const button = document.createElement('button')
    button.textContent = 'Add'

    button.addEventListener('click', () => this.createHabit())

    const backBtn = document.createElement('button')
    backBtn.textContent = 'Back'

    backBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('go-back', {
        bubbles: true
      }))
    })

    wrapper.append(input, select, button, backBtn)
    shadow.appendChild(wrapper)
  }

  /**
   * Creates a new habit.
   *
   */
  createHabit () {
    const name = this.input.value.trim()
    const frequency = this.select.value

    if (!name) return

    this.dispatchEvent(new CustomEvent('create-habit', {
      detail: { name, frequency },
      bubbles: true
    }))

    this.input.value = ''
  }
}

customElements.define('habit-form', HabitForm)
