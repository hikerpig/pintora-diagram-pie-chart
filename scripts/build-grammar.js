const path = require('path')
const { compileGrammar } = require('@pintora/development-kit')

const packagePath = path.resolve(__dirname, '..')

compileGrammar({
  input: path.join('src/parser/pieChart.ne'),
  output: path.join('src/parser/pieChart.ts'),
  basePath: packagePath,
  includePaths: [],
  executeCommand: 'npx',
})
