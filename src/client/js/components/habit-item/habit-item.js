/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

import { loadCSS } from '../../utils/css-loader.js'

/**
 * Represents a single habit item.
 */
class HabitItem extends HTMLElement {
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
   * Renders the habit item.
   */
  render () {
    const shadow = this.shadowRoot

    const old = shadow.querySelector('.wrapper')
    if (old) old.remove()

    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')

    const name = this.dataset.name
    const frequency = this.dataset.frequency
    const completed = this.dataset.completed === 'true'

    const li = document.createElement('li')

    const nameEl = document.createElement('span')
    const freqEl = document.createElement('span')

    freqEl.classList.add('badge')
    freqEl.classList.add(frequency)

    nameEl.textContent = name
    freqEl.textContent = ` ${frequency} `

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit habit'
    editBtn.classList.add('edit-btn')

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete habit'

    deleteBtn.classList.add('delete-btn')

    const btnDiv = document.createElement('div')
    btnDiv.classList.add('button-div')
    btnDiv.append(editBtn, deleteBtn)

    li.append(nameEl, freqEl, btnDiv)

    editBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit-habit', {
        detail: { id: (this.dataset.id) },
        bubbles: true
      }))
    })

    deleteBtn.addEventListener('click', () => {
      if (window.confirm('Are you sure you want to delete this habit')) {
        this.dispatchEvent(new CustomEvent('delete-habit', {
          detail: { id: (this.dataset.id) },
          bubbles: true
        }))
      }
    })

    if (completed) {
      li.classList.add('done')
    }

    li.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('toggle-habit', {
        detail: { id: (this.dataset.id) },
        bubbles: true
      }))
    })

    wrapper.appendChild(li)
    shadow.appendChild(wrapper)
  }
}

customElements.define('habit-item', HabitItem)
