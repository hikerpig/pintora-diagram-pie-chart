const path = require('path')
const { compileGrammar } = require('@pintora/development-kit')

const packagePath = path.resolve(__dirname, '..')

const sharedGrammarsPath = path.dirname(require.resolve('@pintora/diagrams/shared-grammars/whitespace.ne'))

compileGrammar({
  input: path.join('src/parser/pieChart.ne'),
  output: path.join('src/parser/pieChart.ts'),
  basePath: packagePath,
  includePaths: [sharedGrammarsPath],
  executeCommand: 'npx',
})
