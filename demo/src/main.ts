import pintora from '@pintora/standalone'
import { PintoraConfig } from '@pintora/core'
import 'pintora-diagram-pie-chart' // register diagram
import './style.css'

pintora.initBrowser()

const pintoraContainer = document.querySelector('.pintora') as HTMLDivElement

const form = document.getElementById('form')! as HTMLFormElement
// const formData = new FormData(form)
const config: Partial<PintoraConfig['pie']> = {}
form.addEventListener('change', (e: any) => {
  const { target } = e
  let changed = false
  let v
  if (target.type === 'number') {
    v = parseInt(target.value)
    changed = true
  }
  if (typeof v !== 'undefined') {
    (config as any)[target.name] = v
  }
  if (changed) {
    pintora.setConfig({
      pie: config,
    })
    pintora.renderContentOf(pintoraContainer)
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
})
