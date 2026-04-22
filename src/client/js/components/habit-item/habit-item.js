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
  connectedCallback () {
    this.render()
  }

  /**
   * Renders the habit item.
   */
  render () {
    const shadow = this.shadowRoot

    shadow.replaceChildren()

    const name = this.dataset.name

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = new URL('./css/styles.css', import.meta.url)
    shadow.appendChild(style)

    const li = document.createElement('li')
    li.textContent = name

    shadow.appendChild(li)
  }
}

customElements.define('habit-item', HabitItem)
