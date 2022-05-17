import pintora from '@pintora/standalone'
import { PintoraConfig } from '@pintora/core'
import 'pintora-diagram-pie-chart' // register diagram
import './style.css'

const pintoraContainer = document.querySelector('.pintora') as HTMLDivElement
const editor = document.getElementById('editor') as HTMLTextAreaElement

const form = document.getElementById('form')! as HTMLFormElement
const config: Partial<PintoraConfig['pie']> = {}

function updatePreview() {
  const resultContainer = pintoraContainer.parentElement?.querySelector(
    '.preview-result'
  ) as HTMLElement
  resultContainer.innerHTML = ''

  pintora.renderContentOf(pintoraContainer, {
    resultContainer,
    getContent() {
      return editor.value
    },
  })
}

form.addEventListener('change', (e: any) => {
  const { target } = e
  let changed = false
  let v
  if (target.type === 'number') {
    v = parseInt(target.value)
    changed = true
  }
  if (typeof v !== 'undefined') {
    ;(config as any)[target.name] = v
  }
  if (changed) {
    pintora.setConfig({
      pie: config,
    })
    updatePreview()
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
})

editor.addEventListener('input', (e) => {
  updatePreview()
})

updatePreview()
