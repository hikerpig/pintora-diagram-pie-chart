pintora.default.initBrowser()

const pintoraContainer = document.querySelector('.pintora')

const form = document.getElementById('form')
const formData = new FormData(form)
const config = {}
form.addEventListener('change', (e) => {
  const { target } = e
  let changed = false
  let v
  if (target.type === 'number') {
    v = parseInt(target.value)
    changed = true
  }
  if (typeof v !== 'undefined') {
    config[target.name] = v
  }
  if (changed) {
    pintora.default.setConfig({
      pie: config,
    })
    pintora.default.renderContentOf(pintoraContainer)
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
})
