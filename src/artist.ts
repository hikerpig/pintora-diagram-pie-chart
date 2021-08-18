import { IDiagramArtist, GraphicsIR, Group } from '@pintora/core'
import pintora from '@pintora/standalone'
import { PieChartDiagramIR } from './type'

const PIE_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple'
]

const LEGEND_SQUARE_SIZE = 20

type PieConf = {
  diagarmPadding: number
}

const conf: PieConf = {
  diagarmPadding: 10,
}

const pieChartArtist: IDiagramArtist<PieChartDiagramIR> = {
  draw(diagramIR) {
    // console.log('draw', diagramIR)
    const rootMark: Group = {
      type: 'group',
      children: [],
    }

    const radius = 100

    let circleStartY = conf.diagarmPadding
    let circleStartX = conf.diagarmPadding

    if (diagramIR.title) {
      const titleMark = pintora.util.makeMark('text', {
        text: diagramIR.title,
        x: circleStartX + radius,
        y: circleStartY + 10,
        fill: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textBaseline: 'middle',
        textAlign: 'center',
      })
      rootMark.children.push(titleMark)
      circleStartY += 30
    }

    const circleCenter = {
      x: circleStartX + radius,
      y: circleStartY + radius,
    }

    const legendStart = {
      x: circleStartX + radius * 2 + 20,
      y: 30,
    }

    const RAD_OF_A_CIRCLE = Math.PI * 2
    let currentRad = 0
    let currentLabelY = legendStart.y
    diagramIR.items.forEach((item, i) => {
      const fillColor = PIE_COLORS[i % PIE_COLORS.length]
      const rad = (item.count / diagramIR.sum) * RAD_OF_A_CIRCLE
      const destRad = currentRad + rad
      const arcStartX = radius * Math.cos(currentRad)
      const arccircleStartY = radius * Math.sin(currentRad)
      const arcEndX = radius * Math.cos(destRad)
      const arcEndY = radius * Math.sin(destRad)
      const sectorMark = pintora.util.makeMark('path', {
        path: [
          ['M', circleCenter.x, circleCenter.y],
          ['l', arcStartX, arccircleStartY],
          ['a', radius, radius, currentRad, 0, 1, arcEndX - arcStartX, arcEndY - arccircleStartY],
          ['Z']
        ],
        stroke: '#333',
        fill: fillColor,
      })
      currentRad = destRad

      const legendSquare = pintora.util.makeMark('rect', {
        fill: fillColor,
        width: LEGEND_SQUARE_SIZE,
        height: LEGEND_SQUARE_SIZE,
        x: legendStart.x,
        y: currentLabelY,
      })
      const legendLabel = pintora.util.makeMark('text', {
        text: item.name,
        fill: 'black',
        x: legendStart.x + LEGEND_SQUARE_SIZE + 5,
        y: currentLabelY,
        fontSize: 14,
        textBaseline: 'top',
      })
      currentLabelY += LEGEND_SQUARE_SIZE + 5

      rootMark.children.push(sectorMark, legendSquare, legendLabel)
    })

    const graphicsIR: GraphicsIR = {
      width: 400,
      height: circleStartY + 2 * radius + conf.diagarmPadding,
      mark: rootMark,
      bgColor: '#fafafa'
    }
    return graphicsIR
  }
}

export default pieChartArtist