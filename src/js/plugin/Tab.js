/** Tab.js ********************************************************************************************************** */
const PLUGIN_NAME = 'tab'

Object.assign(Object.prototype, {
  Tab (options = {}, value) {
    if (typeof options === 'string') {
      window.PLUGIN.call(this, options, value)
    } else {
      for (let $el of this.length > 0 ? this : [this]) {
        if (!$el.getAttribute('applied-plugin')) {
          window.PLUGIN.add($el, new Tab($el, options), PLUGIN_NAME)
        }
      }
    }
    return this
  }
})

class Tab {
  constructor (el, options) {
    this.$tab = el
    this.$content = el.querySelectorAll('.content')
    this.$button = el.querySelectorAll('.tab-list > button')

    this.options = options
    this.activeIndex = parseInt(options.activeIndex) > 0 ? parseInt(options.activeIndex) : 0
    this.disabledIndex = parseInt(options.disabledIndex) > -1 ? parseInt(options.disabledIndex) : -1

    this.eventHandler = {
      clickTab: e => {
        let idx = [...e.target.parentElement.children].indexOf(e.target)
        if (idx === this.activeIndex) return
        this.active(idx)
        this.$tab.dispatchEvent(new CustomEvent('change', {detail: {activeIndex: idx}}))
      }
    }

    this.$button.forEach(($btn, index) => {
      if (this.disabledIndex == index) {
        $btn.disabled = true
        $btn.classList.add('disabled')
      } else {
        $btn.addEventListener('click', this.eventHandler.clickTab)
      }
    })
    this.active(this.activeIndex)
  }

  active (idx) {
    this.activeIndex = idx
    this.$content.forEach(($content, index) => {
      $content.classList[idx === index ? 'add' : 'remove']('active')
      $content.hidden = !(idx === index)
    })
    this.$button.forEach(($btn, index) => {
      $btn.classList[idx === index ? 'add' : 'remove']('active')
      $btn.setAttribute('aria-selected', idx === index)
    })
  }

  clear () {
    this.active(-1)
    this.$content.forEach($content => $content.removeAttribute('hidden'))
    this.$button.forEach($btn => {
      $btn.disabled = false
      $btn.classList.remove('disabled')
      $btn.removeEventListener('click', this.eventHandler.clickTab)
    })
  }
}
/** ****************************************************************************************************************** */
