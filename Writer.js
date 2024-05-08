const createFunction = languages => ([key, texts]) => {
  const argumentTypes = [...(texts.arguments.map(({ type }) => type)), "String"]
  const arguments = [...(texts.arguments.map(({ variable }) => variable)), "language"]
  const cases = Object.entries(texts.languages).map(([language, { string }]) => {
    return [
      `${languages[language]} ->`,
      `    ${string}`
    ]
  })
  return `
${key} : ${argumentTypes.join(" -> ")}
${key} ${arguments.join(" ")} =
    case language of
${cases.map(parts => parts.map(part => `        ${part}`).join("\n")).join("\n\n")}
  `
}

const createImports = (imports, typeFunctions) => {
  return imports.map(moduleImport => {
    const typeFunction = typeFunctions[moduleImport]
    const exposing = typeFunction ? ` exposing (${typeFunction})` : ''

    return `import ${moduleImport}${exposing}`
  })
}

const create = (json, texts) => {
  const functionNames = Object.keys(texts.entries).sort()

  const functions = Object.entries(texts.entries).map(createFunction(json.locales))

  const imports = createImports(texts.imports, json.typeFunctions || [])

  return `module ${json.module} exposing (${functionNames.join(", ")})

${imports.join("\n")}
  
${functions.join("\n")}
  `
}

module.exports = {
  create
}
