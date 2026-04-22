import '../habit-item/index.js'

/**
 * Displays a list of habits.
 */
class HabitList extends HTMLElement {
  /**
   * Creates the component and attaches a shadoW DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._habits = []
  }

  /**
   * Sets the habit data and re-renders the list.
   */
  set habits (value) {
    this._habits = value
    this.render()
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
   * Renders the list of habits.
   *
   */
  render () {
    const shadow = this.shadowRoot

    shadow.replaceChildren()

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = new URL('./css/styles.css', import.meta.url)
    shadow.appendChild(style)

    const ul = document.createElement('ul')

    this._habits.forEach(habit => {
      const item = document.createElement('habit-item')

      item.dataset.name = habit.name

      ul.appendChild(item)
    })

    shadow.appendChild(ul)
  }
}

customElements.define('habit-list', HabitList)
