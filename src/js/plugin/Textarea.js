/** Textarea.js ********************************************************************************************************** */
const PLUGIN_NAME = 'textarea'

Object.assign(HTMLElement.prototype, {
  Textarea (options = {}, value) {
    if (typeof options === 'string') {
      return window.PLUGIN.call(this, options, value)
    } else {
      if (!this.getAttribute('applied-plugin')) {
        window.PLUGIN.add(this, new Textarea(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Textarea {
  constructor (el, options) {
    this.$textarea = el.querySelector('textarea')
    this.$current = el.querySelector('.current-length')
    this.$total = el.querySelector('.total-length')

    this.options = Object.assign({}, options)
    this.maxlength = parseInt(this.$textarea.getAttribute('maxlength'))
    this.value = this.$textarea.value

    this.$current.innerText = this.value.length
    this.$total.innerText = UTILS.numberFormat.comma(this.maxlength)

    this.eventHandler = {
      typingTextarea: e => {
        let value = e.target.value
        this.value = value
        this.$current.innerText = UTILS.numberFormat.comma(value.length)
      }
    }

    this.$textarea.addEventListener('keydown', this.eventHandler.typingTextarea)
    this.$textarea.addEventListener('keyup', this.eventHandler.typingTextarea)
  }

  get () {
    return {length: parseInt(this.$current.innerText)}
  }
}
/** ****************************************************************************************************************** */
