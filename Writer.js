const LOCALE_TYPE = "Locale"
const STRING_TYPE = "String"
const LOCALE_VARIABLE = "language"

const createFunction = languages => ([key, texts]) => {
  const argumentTypes = [...(texts.arguments.map(({ type }) => type)), LOCALE_TYPE, STRING_TYPE]
  const arguments = [...(texts.arguments.map(({ variable }) => variable)), LOCALE_VARIABLE]
  const cases = Object.entries(texts.languages).map(([language, { string }]) => {
    return [
      `${languages[language]} ->`,
      `    ${string}`
    ]
  })
  return `
${key} : ${argumentTypes.join(" -> ")}
${key} ${arguments.join(" ")} =
    case ${LOCALE_VARIABLE} of
${cases.sort().map(parts => parts.map(part => `        ${part}`).join("\n")).join("\n\n")}
  `
}

const createImports = (imports) => {
  return imports.map(moduleImport => `import ${moduleImport}`)
}

const createLocaleDefinition = locales => {
  const localeTypes = Object.values(locales).join(" | ")
  return `type ${LOCALE_TYPE} = ${localeTypes}`
}

const create = (json, texts) => {
  const functionNames = [`${LOCALE_TYPE}(..)`, ...(Object.keys(texts.entries).sort())]

  const functions = Object.entries(texts.entries).map(createFunction(json.locales))

  const imports = createImports(texts.imports)

  const localeTypeDefinition = createLocaleDefinition(json.locales)

  return `module ${json.module} exposing (${functionNames.join(", ")})

${imports.join("\n")}


${localeTypeDefinition}
  
${functions.join("\n")}
  `
}

module.exports = {
  create
}
