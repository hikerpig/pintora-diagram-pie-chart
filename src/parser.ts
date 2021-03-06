import nearley from '@hikerpig/nearley'
import { ConfigParam, IDiagramParser, PintoraConfig } from '@pintora/core'
import type {
  OverrideConfigAction,
  ParamAction,
} from '@pintora/diagrams/shared-grammars/config'
import grammar from './parser/pieChart'
import { Item, PieChartDiagramIR } from './type'

const parser: IDiagramParser<PieChartDiagramIR> = {
  parse(input: string) {
    const nParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

    // a hack to add a new line as EOF, https://github.com/kach/nearley/issues/194
    const textToParse = input[input.length - 1] !== '\n' ? input + '\n' : input

    nParser.feed(textToParse)

    let results: NearleyParserResult<Action> = nParser.finish()
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

export type NearleyParserResult<T = Action> =
  | Array<NearleyParserResultItem<T>>
  | NearleyParserResultItem<T>

export type NearleyParserResultItem<T> = T[] | T | null

/**
 * Semantic action type and payloads
 */
type ActionPayloads = {
  title: { title: string }
  record: {
    name: string
    count: number
  }
  addParam: ParamAction
  overrideConfig: OverrideConfigAction
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
 * Accept semantic actions to prepare DiagramIR
 */
class PieInterpreter {
  title = ''
  items: Item[] = []

  configParams: ConfigParam[] = []
  overrideConfig: Partial<PintoraConfig> = {}

  ACTION_HANDLERS: {
    [K in keyof ActionPayloads]: ActionHandler<PieInterpreter, K>
  } = {
    title(action) {
      this.title = action.title
    },
    record(action) {
      this.items.push({ name: action.name, count: action.count })
    },
    addParam(action) {
      this.configParams.push(action)
    },
    overrideConfig(action) {
      this.addOverrideConfig(action)
    },
  }

  getDiagramIR(): PieChartDiagramIR {
    // calculate sum
    const sum = this.items.reduce((sum, item) => sum + item.count, 0)
    return {
      title: this.title,
      items: this.items,
      sum,
      configParams: this.configParams,
      overrideConfig: this.overrideConfig,
    }
  }

  /**
   * Apply semantic actions to change interpreter's inner state
   */
  apply(action: NearleyParserResult) {
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

  protected addOverrideConfig(action: OverrideConfigAction) {
    if ('error' in action) {
      console.error(action.error)
    } else {
      this.overrideConfig = action.value
    }
  }
}

export default parser
