// type augmentation
declare module '@pintora/core' {
  interface PintoraConfig {
    pie: {
      diagarmPadding: number
      diagramBackgroundColor: string
      circleRadius: number
      pieColors: string[]
    }
  }
}

export type Item = {
  name: string
  count: number
}

export type PieChartDiagramIR = {
  title: string
  items: Item[]
  sum: number
}