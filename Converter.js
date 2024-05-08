const REGEX = /\{\{(([a-zA-Z]+)(\: ?([A-Za-z\.]+))?)\}\}/g

const GLOBAL_MODULES = [
  "String", "Int", "Bool", "Float", "Dict",
]

const interspeseText = (acc, currentString, variables, typeFunctions) => {
  if (variables.length == 0 || currentString == "") {
    return acc
  }
  const [{ variable, expression, type }, ...rest] = variables
  const typeFunction = typeFunctions[type]
  const variableWithFunction = typeFunction ? `${[type, typeFunction].join(".")} ${variable}` : variable

  const leftPart = currentString.slice(0, currentString.indexOf(expression))
  const rightPart = currentString.slice(leftPart.length + expression.length)

  return interspeseText([...acc, `"${leftPart}"`, variableWithFunction], rightPart, rest, typeFunctions)
}

const convertExpression = (text, typeFunctions) => {

  const variables = [...text.matchAll(REGEX)].map(([expression, _, variable, ...rest]) => {
    const type = rest[1] || 'String'
    return { expression, variable, type }
  })

  const interspesedText = interspeseText([], text, variables, typeFunctions)
  const string = interspesedText.length == 0 ? `"${text}"` : interspesedText.join(" ++ ")

  return {
    string,
    variables
  }
}

const convert = (json) => {
  return Object.entries(json.texts).reduce(({ entries, imports }, [key, value]) => {
    const perLanguage = Object.entries(value).reduce((acc, [language, text]) => {
      return { ...acc, [language]: convertExpression(text, json.typeFunctions) };
    }, {})


    const message = {
      languages: perLanguage,
      arguments: Object.values(perLanguage)[0].variables.map(({ variable, type }) => ({ variable, type }))
    }

    const newImports = message.arguments.map(({ type }) => type).filter(type => !GLOBAL_MODULES.includes(type))

    return {
      entries: { ...entries, [key]: message },
      imports: [...imports, ...newImports]
    }
  }, { entries: {}, imports: [] })
}

module.exports = {
  convert
}
