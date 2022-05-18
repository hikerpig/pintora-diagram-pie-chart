import pintora from '@pintora/standalone'
import { PintoraConfig } from '@pintora/core'
import 'pintora-diagram-pie-chart' // register diagram
import './style.css'

const pintoraContainer = document.querySelector('.pintora') as HTMLDivElement
const editor = document.getElementById('editor') as HTMLTextAreaElement
const updateBtn = document.getElementById('update-btn')

const form = document.getElementById('form')! as HTMLFormElement
const config: Partial<PintoraConfig['pie']> = {}
const INIT_SOURCE = `pie 
  title Bag of Fruits
  "apple" 5
  "peach" 6 
  "banana" 20`

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
  console.log('form change', target)
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
  e.stopPropagation()
  console.log('submit')
})

editor.addEventListener('input', (e) => {
  updatePreview()
})

updateBtn!.addEventListener('click', () => {
  const formData = new FormData(form)
  const data: any = {}
  formData.forEach((v, k) => {
    data[k] = v
  })
  data.circleRadius = parseFloat(data.circleRadius)
  pintora.setConfig({
    pie: data,
  })

  updatePreview()
})

editor.value = INIT_SOURCE
updatePreview()
