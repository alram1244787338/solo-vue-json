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

export function validateJson(jsonStr) {
  if (typeof jsonStr !== 'string' || jsonStr.trim() === '') {
    return { valid: false, line: 1, column: 1, message: 'Empty input' }
  }
  try {
    JSON.parse(jsonStr)
    return { valid: true }
  } catch (e) {
    const err = parseError(e, jsonStr)
    return {
      valid: false,
      line: err.line,
      column: err.column,
      message: err.message
    }
  }
}

function parseError(error, jsonStr) {
  const pos = findErrorPosition(jsonStr)
  const lines = jsonStr.slice(0, pos).split('\n')
  const line = lines.length
  const column = lines[lines.length - 1].length + 1
  return {
    message: error.message,
    line,
    column
  }
}

export function findErrorPosition(jsonStr) {
  let i = 0
  const len = jsonStr.length

  function skipWhitespace() {
    while (i < len) {
      const c = jsonStr[i]
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
        i++
      } else {
        break
      }
    }
  }

  function parseString() {
    if (jsonStr[i] !== '"') return false
    i++
    while (i < len) {
      const c = jsonStr[i]
      if (c === '\\') {
        i += 2
        continue
      }
      if (c === '"') {
        i++
        return true
      }
      if (c === '\n' || c === '\r') {
        return false
      }
      i++
    }
    return false
  }

  function parseNumber() {
    const start = i
    if (jsonStr[i] === '-') i++
    if (i >= len) return false
    if (jsonStr[i] === '0') {
      i++
    } else if (jsonStr[i] >= '1' && jsonStr[i] <= '9') {
      while (i < len && jsonStr[i] >= '0' && jsonStr[i] <= '9') i++
    } else {
      return false
    }
    if (i < len && jsonStr[i] === '.') {
      i++
      if (i >= len || jsonStr[i] < '0' || jsonStr[i] > '9') return false
      while (i < len && jsonStr[i] >= '0' && jsonStr[i] <= '9') i++
    }
    if (i < len && (jsonStr[i] === 'e' || jsonStr[i] === 'E')) {
      i++
      if (i < len && (jsonStr[i] === '+' || jsonStr[i] === '-')) i++
      if (i >= len || jsonStr[i] < '0' || jsonStr[i] > '9') return false
      while (i < len && jsonStr[i] >= '0' && jsonStr[i] <= '9') i++
    }
    return i > start
  }

  function parseKeyword(kw) {
    if (jsonStr.slice(i, i + kw.length) === kw) {
      i += kw.length
      return true
    }
    return false
  }

  function parseValue() {
    skipWhitespace()
    if (i >= len) return false
    const c = jsonStr[i]
    if (c === '"') return parseString()
    if (c === '{' || c === '[') return parseContainer()
    if (c === 't') return parseKeyword('true')
    if (c === 'f') return parseKeyword('false')
    if (c === 'n') return parseKeyword('null')
    if (c === '-' || (c >= '0' && c <= '9')) return parseNumber()
    return false
  }

  function parseContainer() {
    const open = jsonStr[i]
    const close = open === '{' ? '}' : ']'
    i++
    skipWhitespace()
    if (i < len && jsonStr[i] === close) {
      i++
      return true
    }
    while (i < len) {
      skipWhitespace()
      if (open === '{') {
        if (!parseString()) return false
        skipWhitespace()
        if (i >= len || jsonStr[i] !== ':') return false
        i++
      }
      if (!parseValue()) return false
      skipWhitespace()
      if (i < len && jsonStr[i] === ',') {
        i++
        continue
      }
      if (i < len && jsonStr[i] === close) {
        i++
        return true
      }
      return false
    }
    return false
  }

  skipWhitespace()
  if (i >= len) return 0
  const ok = parseValue()
  if (!ok) {
    return i
  }
  skipWhitespace()
  if (i < len) {
    return i
  }
  return len
}

export function format(jsonStr, indent = 4) {
  JSON.parse(jsonStr)
  const indentStr = ' '.repeat(indent)
  let result = ''
  let level = 0
  let inString = false
  let i = 0
  const len = jsonStr.length

  function newlineAndIndent() {
    result += '\n' + indentStr.repeat(level)
  }

  while (i < len) {
    const c = jsonStr[i]

    if (inString) {
      result += c
      if (c === '\\') {
        result += jsonStr[i + 1] || ''
        i += 2
        continue
      }
      if (c === '"') {
        inString = false
      }
      i++
      continue
    }

    if (c === '"') {
      inString = true
      result += c
      i++
      continue
    }

    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++
      continue
    }

    if (c === '{' || c === '[') {
      result += c
      level++
      let hasContent = false
      let j = i + 1
      while (j < len) {
        const nc = jsonStr[j]
        if (nc === ' ' || nc === '\t' || nc === '\n' || nc === '\r') {
          j++
          continue
        }
        if (nc === '}' || nc === ']') {
          break
        }
        hasContent = true
        break
      }
      if (hasContent) {
        newlineAndIndent()
      } else {
        const closeChar = c === '{' ? '}' : ']'
        while (j < len) {
          if (jsonStr[j] === closeChar) {
            result += closeChar
            i = j + 1
            level--
            break
          }
          j++
        }
        continue
      }
      i++
      continue
    }

    if (c === '}' || c === ']') {
      level--
      newlineAndIndent()
      result += c
      i++
      continue
    }

    if (c === ':') {
      result += ': '
      i++
      continue
    }

    if (c === ',') {
      result += ','
      newlineAndIndent()
      i++
      continue
    }

    result += c
    i++
  }

  return result
}

export function minify(jsonStr) {
  JSON.parse(jsonStr)
  let result = ''
  let inString = false
  let i = 0
  const len = jsonStr.length

  while (i < len) {
    const c = jsonStr[i]

    if (inString) {
      result += c
      if (c === '\\') {
        result += jsonStr[i + 1] || ''
        i += 2
        continue
      }
      if (c === '"') {
        inString = false
      }
      i++
      continue
    }

    if (c === '"') {
      inString = true
      result += c
      i++
      continue
    }

    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++
      continue
    }

    result += c
    i++
  }

  return result
}

export const formatJson = format
export const minifyJson = minify
