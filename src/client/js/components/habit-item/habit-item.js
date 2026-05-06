/**
 * @author Hanna Mårtensson <hm223dq@student.lnu.se>
 * @version 1.0.0
 */

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

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = new URL('./css/styles.css', import.meta.url)
    this.shadowRoot.appendChild(style)
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
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

    li.append(nameEl, freqEl)

    if (completed) {
      li.classList.add('done')
    }

    li.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('toggle-habit', {
        detail: { id: Number(this.dataset.id) },
        bubbles: true
      }))
    })

    wrapper.appendChild(li)
    shadow.appendChild(wrapper)
  }
}

customElements.define('habit-item', HabitItem)
