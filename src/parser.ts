import { IDiagramParser } from '@pintora/core'
import { PieChartDiagramIR, Item } from './type'

const TITLE_REGEXP = /^title\s*(.*)/
const RECORD_REGEXP = /^\"(.*)\"\s+([\d\.-]+)/

const parser: IDiagramParser<PieChartDiagramIR> = {
  parse(input: string) {
    const ir: PieChartDiagramIR = {
      title: '',
      items: [],
      sum: 0,
    }

    const lines = input.split('\n')
    for (const line of lines) {
      let match
      const trimmedLine = line.trim()
      if (match = TITLE_REGEXP.exec(trimmedLine)) {
        ir.title = match[1]
        continue
      }
      if (match = RECORD_REGEXP.exec(trimmedLine)) {
        const item: Item = {
          name: match[1],
          count: parseFloat(match[2]),
        }
        ir.items.push(item)
        continue
      }
    }

    ir.sum = ir.items.reduce((sum, item) => sum + item.count, 0)

    return ir
  }
}

export default parser