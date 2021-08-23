import { IDiagramArtist, GraphicsIR, Group } from '@pintora/core'
import pintora, { IFont } from '@pintora/standalone'
import { PieChartDiagramIR } from './type'

const PIE_COLORS = [
  '#ecb3b2',
  '#efc9b3',
  '#f5f6b8',
  '#c6f4b7',
  '#bce6f5',
  '#cdb2f2',
  '#ecb4ee',
]

const LEGEND_SQUARE_SIZE = 20
const LEGEND_FONT: IFont = {
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
}

type PieConf = {
  diagarmPadding: number
  diagramBackgroundColor: string
  circleRadius: number
}

const conf: PieConf = {
  diagarmPadding: 10,
  diagramBackgroundColor: '#F9F9F9',
  circleRadius: 150,
}

const pieChartArtist: IDiagramArtist<PieChartDiagramIR> = {
  draw(diagramIR) {
    // console.log('draw', diagramIR)
    const rootMark: Group = {
      type: 'group',
      children: [],
    }

    const radius = conf.circleRadius

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
      y: circleStartY,
    }

    const RAD_OF_A_CIRCLE = Math.PI * 2
    let currentRad = 0
    let currentLabelY = legendStart.y
    let maxLabelRight = 0
    diagramIR.items.forEach((item, i) => {
      const fillColor = PIE_COLORS[i % PIE_COLORS.length]
      const rad = (item.count / diagramIR.sum) * RAD_OF_A_CIRCLE
      const destRad = currentRad + rad
      const arcStartX = radius * Math.cos(currentRad)
      const arcStartY = radius * Math.sin(currentRad)
      const arcEndRel = {
        x: radius * Math.cos(destRad),
        y: radius * Math.sin(destRad),
      }
      const sectorMark = pintora.util.makeMark('path', {
        path: [
          ['M', circleCenter.x, circleCenter.y],
          ['l', arcStartX, arcStartY],
          [
            'a',
            radius,
            radius,
            currentRad,
            0,
            1,
            arcEndRel.x - arcStartX,
            arcEndRel.y - arcStartY,
          ],
          ['Z'],
        ],
        stroke: '#333',
        fill: fillColor,
      })

      // draw percentage label
      const pLabelX =
        circleCenter.x + (radius * Math.cos(currentRad + rad / 2)) / 2
      const pLabelY =
        circleCenter.y + (radius * Math.sin(currentRad + rad / 2)) / 2
      const pLabel = pintora.util.makeMark('text', {
        text: `${Math.floor((100 * item.count) / diagramIR.sum)}%`,
        fill: 'black',
        x: pLabelX,
        y: pLabelY,
        textAlign: 'center',
        textBaseline: 'middle',
      })

      // draw legend
      const legendSquare = pintora.util.makeMark('rect', {
        fill: fillColor,
        width: LEGEND_SQUARE_SIZE,
        height: LEGEND_SQUARE_SIZE,
        x: legendStart.x,
        y: currentLabelY,
      })

      const labelX = legendStart.x + LEGEND_SQUARE_SIZE + 5
      const legendLabel = pintora.util.makeMark('text', {
        text: item.name,
        fill: 'black',
        x: labelX,
        y: currentLabelY,
        ...(LEGEND_FONT as any),
        textBaseline: 'top',
      })

      currentRad = destRad
      currentLabelY += LEGEND_SQUARE_SIZE + 5

      const labelDims = pintora.util.calculateTextDimensions(
        item.name,
        LEGEND_FONT
      )
      maxLabelRight = Math.max(maxLabelRight, labelX + labelDims.width)

      const itemGroup: Group = {
        type: 'group',
        children: [sectorMark, pLabel, legendSquare, legendLabel],
        class: 'pie__item'
      }
      rootMark.children.push(itemGroup)
    })

    const diagramWidth = maxLabelRight + conf.diagarmPadding

    const graphicsIR: GraphicsIR = {
      mark: rootMark,
      width: diagramWidth,
      height: circleStartY + 2 * radius + conf.diagarmPadding,
      bgColor: conf.diagramBackgroundColor,
    }
    return graphicsIR
  },
}

export default pieChartArtist
