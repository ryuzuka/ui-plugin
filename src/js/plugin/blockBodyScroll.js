/** blockBodyScroll.js ****************************************************************************************************** */
;($ => {
  let _plugin = null

  $.extend({
    blockBodyScroll: function (isBlock) {
      _plugin = _plugin || new BlockBodyScroll()
      _plugin[isBlock ? 'block' : 'scroll']()

      return _plugin
    }
  })

  class BlockBodyScroll {
    constructor () {
      this.prevScroll = 0
      this.$body = $('body')
      this.isBlock = false
    }

    block () {
      if (this.isBlock) return
      this.isBlock = true

      this.prevScroll = window.scrollY || window.pageYOffset
      let style = 'overflow: hidden; width: 100%; height: 100%; min-width: 100%; min-height: 100%;'
      if ($.utils.isMobile()) {
        style += ' ' + `position: fixed; margin-top: ${-1 * this.prevScroll}px;`
      }
      this.$body.attr('style', style).addClass('block-body-scroll')
    }

    scroll () {
      if (!this.isBlock) return
      this.isBlock = false

      this.$body.removeAttr('style').removeClass('block-body-scroll')
      $(window).scrollTop(this.prevScroll)
    }
  }
})(window.jQuery)
/** ***************************************************************************************************************** */
