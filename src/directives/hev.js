export default {
  update(value) {
    if (!value)
      value = {}
    if (value.margin) {
      let arr = value.margin.split(' ')
      value.top = arr[0]
      value.right = arr[1]
      value.bottom = arr[2] ? arr[2] : value.top
      value.left = arr[3] ? arr[3] : value.right
    }
    let classNames = this.el.className.split(' ')
    let foundClassName = false
    classNames.forEach(function (className) {
      if (className == 'hiv')
        foundClassName = true
    })
    if (!foundClassName)
      classNames.push('hiv')
    this.el.className = classNames.join(' ')
    this.el.style['text-align'] = 'center'
    value.top ? (this.el.style['margin-top'] = value.top) : 0
    value.bottom ? (this.el.style['margin-bottom'] = value.bottom) : 0
    let childElementCount = this.el.childElementCount
    for (var i = 0; i < this.el.childElementCount; i++) {
      this.el.children[i].style.width = 100 / childElementCount + '%'
    }
  }
}