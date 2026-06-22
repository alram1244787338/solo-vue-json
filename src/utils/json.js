export function validate(jsonStr) {
  if (typeof jsonStr !== 'string' || jsonStr.trim() === '') {
    return null
  }
  try {
    JSON.parse(jsonStr)
    return null
  } catch (e) {
    return parseError(e, jsonStr)
  }
}

function parseError(error, jsonStr) {
  const match = error.message.match(/position (\d+)/)
  let line = 1
  let column = 1
  if (match) {
    const position = parseInt(match[1], 10)
    const lines = jsonStr.slice(0, position).split('\n')
    line = lines.length
    column = lines[lines.length - 1].length + 1
  }
  return {
    message: error.message,
    line,
    column
  }
}

export function format(jsonStr, indent = 4) {
  const parsed = JSON.parse(jsonStr)
  return JSON.stringify(parsed, null, indent)
}

export function minify(jsonStr) {
  const parsed = JSON.parse(jsonStr)
  return JSON.stringify(parsed)
}
