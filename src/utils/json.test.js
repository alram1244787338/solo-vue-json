import { describe, it, expect } from 'vitest'
import {
  format,
  formatJson,
  minify,
  minifyJson,
  validate,
  validateJson,
  findErrorPosition
} from '@/utils/json.js'

describe('json utils', () => {
  describe('format / formatJson', () => {
    it('formats simple JSON with 4-space indent', () => {
      const input = '{"a":1,"b":"x"}'
      const result = format(input)
      expect(result).toBe(`{
    "a": 1,
    "b": "x"
}`)
    })

    it('formats nested arrays correctly', () => {
      const input = '[[1,2],[3,4]]'
      const result = format(input)
      expect(result).toBe(`[
    [
        1,
        2
    ],
    [
        3,
        4
    ]
]`)
    })

    it('preserves escape characters (newline, tab, backslash, quote)', () => {
      const input = '{"msg":"hello\\nworld\\t!","path":"C:\\\\Users\\\\test","quote":"say \\"hi\\""}'
      const result = format(input)
      expect(result).toContain('hello\\nworld\\t!')
      expect(result).toContain('C:\\\\Users\\\\test')
      expect(result).toContain('say \\"hi\\"')
    })

    it('keeps empty objects on one line', () => {
      const input = '{"a":{},"b":[]}'
      const result = format(input)
      expect(result).toBe(`{
    "a": {},
    "b": []
}`)
    })

    it('formatJson is an alias for format', () => {
      const input = '{"x":1}'
      expect(formatJson(input)).toBe(format(input))
    })

    it('indent levels are correct for deep nesting', () => {
      const input = '{"a":{"b":{"c":1}}}'
      const result = format(input)
      const lines = result.split('\n')
      expect(lines[0]).toBe('{')
      expect(lines[1]).toMatch(/^    "a": \{$/)
      expect(lines[2]).toMatch(/^        "b": \{$/)
      expect(lines[3]).toMatch(/^            "c": 1$/)
    })
  })

  describe('minify / minifyJson', () => {
    it('removes all whitespace from JSON', () => {
      const input = `{
    "a": 1,
    "b": "x"
}`
      const result = minify(input)
      expect(result).toBe('{"a":1,"b":"x"}')
      expect(result).not.toMatch(/\s/)
    })

    it('minifies nested arrays', () => {
      const input = `[
    [1, 2],
    [3, 4]
]`
      const result = minify(input)
      expect(result).toBe('[[1,2],[3,4]]')
    })

    it('preserves escape characters when minifying', () => {
      const input = '{"msg":"hello\\nworld"}'
      const result = minify(input)
      expect(result).toBe('{"msg":"hello\\nworld"}')
      expect(result).toContain('\\n')
    })

    it('round-trip: format then minify equals original', () => {
      const orig = '{"text":"line1\\nline2\\twith tab","path":"C:\\\\Users\\\\test","quote":"say \\"hi\\""}'
      const formatted = format(orig)
      const minified = minify(formatted)
      expect(minified).toBe(orig)
    })

    it('minifyJson is an alias for minify', () => {
      const input = '{"x": 1}'
      expect(minifyJson(input)).toBe(minify(input))
    })
  })

  describe('validateJson', () => {
    it('returns valid:true for valid JSON object', () => {
      const result = validateJson('{"a":1,"b":"x"}')
      expect(result).toEqual({ valid: true })
    })

    it('returns valid:true for valid JSON array', () => {
      const result = validateJson('[1,2,3]')
      expect(result).toEqual({ valid: true })
    })

    it('returns valid:true for simple values', () => {
      expect(validateJson('"hello"').valid).toBe(true)
      expect(validateJson('42').valid).toBe(true)
      expect(validateJson('true').valid).toBe(true)
      expect(validateJson('null').valid).toBe(true)
    })

    it('returns valid:false with position for unquoted key', () => {
      const result = validateJson('{a:1}')
      expect(result.valid).toBe(false)
      expect(result.line).toBe(1)
      expect(typeof result.column).toBe('number')
      expect(typeof result.message).toBe('string')
    })

    it('returns valid:false with position for trailing comma', () => {
      const result = validateJson('{"a":1,}')
      expect(result.valid).toBe(false)
      expect(result.line).toBe(1)
      expect(typeof result.column).toBe('number')
    })

    it('returns valid:false for empty string', () => {
      const result = validateJson('')
      expect(result.valid).toBe(false)
    })

    it('returns valid:false for whitespace only', () => {
      const result = validateJson('   \n\t  ')
      expect(result.valid).toBe(false)
    })

    it('detects error on correct line in multiline JSON', () => {
      const badJson = `{
  "name": "test",
  "count": 42
  bad syntax
}`
      const result = validateJson(badJson)
      expect(result.valid).toBe(false)
      expect(result.line).toBe(4)
    })
  })

  describe('findErrorPosition', () => {
    it('finds position for unquoted key at start', () => {
      const pos = findErrorPosition('{a:1}')
      expect(pos).toBe(1)
    })

    it('finds position for trailing comma', () => {
      const pos = findErrorPosition('{"a":1,}')
      expect(pos).toBe(7)
    })

    it('finds position in multiline JSON', () => {
      const badJson = `{
  "name": "test",
  bad
}`
      const pos = findErrorPosition(badJson)
      const line = badJson.slice(0, pos).split('\n').length
      expect(line).toBe(3)
    })

    it('returns position after valid JSON when extra chars exist', () => {
      const pos = findErrorPosition('{"a":1} extra')
      expect(pos).toBeGreaterThan(6)
    })

    it('returns 0 for completely empty input', () => {
      expect(findErrorPosition('')).toBe(0)
    })
  })
})
