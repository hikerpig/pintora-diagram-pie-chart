import { IDiagram } from '@pintora/core'
import pintora from '@pintora/standalone'
import { PieChartDiagramIR } from './type'
export * from './type'
import parser from './parser'
import artist from './artist'

const pieChartDiagram: IDiagram<PieChartDiagramIR> = {
  pattern: /^\s*pie\s*\n/,
  parser,
  artist,
  clear() {}
}

pintora.diagramRegistry.registerDiagram('pieChart', pieChartDiagram)