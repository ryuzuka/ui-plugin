/** Paging.js ********************************************************************************************************** */
let PLUGIN_NAME = 'paging'

Object.assign(Object.prototype, {
  Paging (options = {}, value) {
    if (typeof options === 'string') {
      return window.PLUGIN.call(this, options, value)

    } else {
      let plugin = null
      for (let $el of this.length > 0 ? Array.from(this) : new Array(this)) {
        if (!$el.getAttribute('applied-plugin')) {
          window.PLUGIN.add($el, plugin = new Paging($el, options), PLUGIN_NAME)
        }
      }
      return plugin
    }
  }
})

class Paging {
  constructor (el, options) {
    this.$paging = el
    this.$pagingContainer = el.querySelector('.paging-list')

    this.options = options
    this.total = options.total                                        // 전체 리스트 갯수
    this.offset = options.offset || 0                                 // 현재 페이지 번호
    this.limit = options.limit || 10                                  // 화면에 보여지는 리스트 갯수
    this.pagingLength = options.pagingLength || 10                    // 화면에 보여지는 paging button 갯수
    this.totalPage = Math.ceil(options.total / this.limit)            // 전체 페이지 갯수
    this.pagingGroup = []
    this.groupIndex = 0

    this.eventHandler = {
      clickPaging: e => {
        e.preventDefault()
        let {tagName, className} = e.currentTarget

        if (tagName === 'A') {
          let pageIndex = parseInt(e.target.dataset.pageIndex)
          if (this.offset === pageIndex) return

          this.offset = pageIndex
          this.active(this.groupIndex, this.offset)

        } else if (tagName === 'BUTTON') {
          if (className.indexOf('first') > 0) {
            this.groupIndex = 0
            this.offset = 0

          } else if (className.indexOf('prev') > 0) {
            this.groupIndex--
            this.offset = this.pagingGroup[this.groupIndex][0].pageIndex

          } else if (className.indexOf('next') > 0) {
            this.groupIndex++
            this.offset = this.pagingGroup[this.groupIndex][0].pageIndex

          } else if (className.indexOf('last') > 0) {
            this.groupIndex = this.pagingGroup.length - 1
            this.offset = this.totalPage - 1
          }
          this.draw(this.groupIndex, this.offset)
          this.active(this.groupIndex, this.offset)
        }
      }
    }

    this.setPaging(this.offset)
    this.draw(this.groupIndex)
    this.active(this.groupIndex, this.offset)

    this.addEvent()
  }

  addEvent () {
    this.$paging.querySelectorAll('button').forEach($btn => {
      $btn.addEventListener('click', this.eventHandler.clickPaging)
    })
    this.$paging.querySelectorAll('a').forEach($a => {
      $a.addEventListener('click', this.eventHandler.clickPaging)
    })
  }

  removeEvent () {
    this.$paging.querySelectorAll('button').forEach($btn => {
      $btn.removeEventListener('click', this.eventHandler.clickPaging)
    })
    this.$paging.querySelectorAll('a').forEach($a => {
      $a.removeEventListener('click', this.eventHandler.clickPaging)
    })
  }

  setPaging (offset) {
    let length = this.pagingLength
    let total = this.totalPage

    this.pagingGroup = []
    for (let i = 0; i < Math.ceil(total / length); ++i) {           // pagingGroupLength
      this.pagingGroup.push([])

      let pagingLength = total - i * length > length ? length : total - i * length
      for (let j = 0; j < pagingLength; ++j) {
        this.pagingGroup[i][j] = {
          index: j,
          pageIndex: this.pagingLength * i + j,
          text: this.pagingLength * i + j + 1
        }
        if (offset === this.pagingLength * i + j) {
          this.groupIndex = i
        }
      }
    }
  }

  draw (groupIdx) {
    this.removeEvent()

    this.$pagingContainer.innerHTML = this.pagingGroup[groupIdx].map(page => {
      return `<a href="#" aria-current="false" data-page-index="${page.pageIndex}">${page.text}</a>`
    }).join('')
    this.addEvent()
  }

  active (groupIdx, offset) {
    let curIdx = this.pagingGroup[this.groupIndex].find(page => offset === page.pageIndex).index

    this.$paging.querySelectorAll('a').forEach(($a, index) => {
      $a.classList[index === curIdx ? 'add' : 'remove']('active')
      $a.setAttribute('aria-current', index === curIdx ? true : false)
      if ($a.classList.length < 1) {
        $a.removeAttribute('class')
      }
    })

    this.$paging.querySelectorAll('button').forEach($pagingBtn => {
      $pagingBtn.disabled = false
    })

    if (offset === this.pagingGroup[0][0].pageIndex) {
      this.$paging.querySelector('.paging-first').disabled = true
    }
    if (groupIdx === 0) {
      this.$paging.querySelector('.paging-prev').disabled = true
    }
    if (groupIdx === this.pagingGroup.length - 1) {
      this.$paging.querySelector('.paging-next').disabled = true
    }
    let lastGroup = this.pagingGroup[this.pagingGroup.length - 1]
    if (offset === lastGroup[lastGroup.length - 1].pageIndex) {
      this.$paging.querySelector('.paging-last').disabled = true
    }

    this.$paging.dispatchEvent(new CustomEvent('change', {
      detail: {offset: this.offset, total: this.total}
    }))
  }

  set (offset) {
    this.offset = offset
    this.setPaging(this.offset)
    this.draw(this.groupIndex)
    this.active(this.groupIndex, this.offset)
  }

  get () {
    return parseInt(this.offset)
  }

  clear () {
    this.removeEvent()
    this.$pagingContainer.innerHTML = ''
  }
}
/** ****************************************************************************************************************** */
