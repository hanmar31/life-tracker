import '../habit-list/index.js'

/**
 * Represents the main Habit App.
 */
class HabitApp extends HTMLElement {
  /**
   * Creates the component and attaches a shadoW DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.habits = [
      { id: 1, name: 'Workout' },
      { id: 2, name: 'Drink water' },
      { id: 3, name: 'Study' }
    ]
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
    this.render()
  }

  /**
   * Renders the habit app UI.
   */
  render () {
    const shadow = this.shadowRoot

    shadow.replaceChildren()

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = new URL('./css/styles.css', import.meta.url)
    shadow.appendChild(style)

    const title = document.createElement('h1')
    title.textContent = 'Life Tracker'
    shadow.appendChild(title)

    const list = document.createElement('habit-list')
    list.habits = this.habits
    shadow.appendChild(list)
  }
}

customElements.define('habit-app', HabitApp)
