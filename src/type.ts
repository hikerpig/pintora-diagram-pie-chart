export type Item = {
  name: string
  count: number
}

export type PieChartDiagramIR = {
  title: string
  items: Item[]
  sum: number
}