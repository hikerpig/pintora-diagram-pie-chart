import { IDiagramParser } from '@pintora/core'
import { PieChartDiagramIR, Item } from './type'
import grammar from './parser/pieChart'
import nearley from '@hikerpig/nearley'

const parser: IDiagramParser<PieChartDiagramIR> = {
  parse(input: string) {
    const nParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    // a hack to add a new line as EOF, https://github.com/kach/nearley/issues/194
    const textToParse = input[input.length - 1] !== '\n' ? input + '\n' : input

    nParser.feed(textToParse)
    let results = nParser.finish()
    // console.log('result', results)
    // dedupe ambigous results
    if (Array.isArray(results[0])) {
      results = results[0]
    }

    const interpreter = new PieInterpreter()
    interpreter.apply(results)

    // after all actions are applied, we can return the final diagram ir
    const ir = interpreter.getDiagramIR()
    return ir
  },
}

/**
 * Semantic action type and payloads
 */
type ActionPayloads = {
  title: { title: string }
  record: {
    name: string
    count: number
  }
}

type ActionObj<K extends keyof ActionPayloads> = {
  type: K
} & ActionPayloads[K]

export type Action = ActionObj<keyof ActionPayloads>

type ActionHandler<D, T extends keyof ActionPayloads> = (
  this: D,
  action: ActionObj<T>
) => unknown

/**
 * accept semantic action list with `apply` method
 */
class PieInterpreter {
  title = ''
  items: Item[] = []

  ACTION_HANDLERS: {
    [K in keyof ActionPayloads]: ActionHandler<PieInterpreter, K>
  } = {
    title(action) {
      this.title = action.title
    },
    record(action) {
      this.items.push({ name: action.name, count: action.count })
    },
  }

  getDiagramIR(): PieChartDiagramIR {
    const sum = this.items.reduce((sum, item) => sum + item.count, 0)
    return {
      title: this.title,
      items: this.items,
      sum,
    }
  }

  apply(action: Action | Action[] | null) {
    if (!action) return

    if (Array.isArray(action)) {
      for (const act of action) {
        this.apply(act)
      }
      return
    }
    if (action.type in this.ACTION_HANDLERS) {
      this.ACTION_HANDLERS[action.type].call(this, action as any)
    }
  }
}

export default parser
