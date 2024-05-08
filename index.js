const nopt = require('nopt')
const fs = require('fs')
const Converter = require('./Converter.js')
const Writer = require('./Writer.js')

const parsed = nopt({
  input: String,
  output: String
})

if (parsed.input && parsed.output && parsed.input != parsed.output) {
  const content = JSON.parse(fs.readFileSync(parsed.input))

  const converted = Converter.convert(content)
  const elmContent = Writer.create(content, converted)

  fs.writeFileSync(parsed.output, elmContent)
}


