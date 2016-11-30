export default {
  update(data) {
    if (!data || !(data instanceof Object))
      data = {}
    if (!data.width)
      data.width = this.el.style.width ? this.el.style.width : '100%'
    if (data.padding) {
      let arr = data.padding.split(' ')
      data.top = arr[0]
      data.left = arr[1] ? arr[1] : data.top
      data.bottom = arr[2] ? arr[2] : data.top
      data.right = arr[3] ? arr[3] : data.left
    }
    console.log(data)
    this.el.style.width = data.width
    this.el.style['padding-top'] = data.width
    this.el.style['max-height'] = 0
    this.el.style.overflow = 'hidden'
    this.el.style.position = 'relative'
    if (!this.el.children[0])
      return
    this.el.children[0].style.position = 'absolute'
    this.el.children[0].style.top = data.top ? data.top : 0
    this.el.children[0].style.bottom = data.bottom ? data.bottom : 0
    this.el.children[0].style.left = data.left ? data.left : 0
    this.el.children[0].style.right = data.right ? data.right : 0
    this.el.children[0].style.overflow = 'hidden'
  }
}