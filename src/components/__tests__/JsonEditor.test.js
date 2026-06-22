import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JsonEditor from '@/components/JsonEditor.vue'

describe('JsonEditor.vue', () => {
  it('disables format and minify buttons when empty', () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    const formatBtn = wrapper.find('.btn-primary')
    const minifyBtn = wrapper.find('.btn-secondary')

    expect(formatBtn.isDisabled()).toBe(true)
    expect(minifyBtn.isDisabled()).toBe(true)
  })

  it('disables buttons when invalid JSON is entered', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.setProps({ modelValue: '{bad json}' })
    await wrapper.vm.$nextTick()

    const formatBtn = wrapper.find('.btn-primary')
    const minifyBtn = wrapper.find('.btn-secondary')

    expect(formatBtn.isDisabled()).toBe(true)
    expect(minifyBtn.isDisabled()).toBe(true)
  })

  it('enables format and minify buttons when valid JSON is entered', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.setProps({ modelValue: '{"a": 1, "b": "test"}' })
    await wrapper.vm.$nextTick()

    const formatBtn = wrapper.find('.btn-primary')
    const minifyBtn = wrapper.find('.btn-secondary')

    expect(formatBtn.isDisabled()).toBe(false)
    expect(minifyBtn.isDisabled()).toBe(false)
  })

  it('shows tooltip when buttons are disabled', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    const tooltips = wrapper.findAll('.tooltip')
    expect(tooltips.length).toBe(2)
    tooltips.forEach((tooltip) => {
      expect(tooltip.text()).toContain('请先输入有效的 JSON')
    })
  })

  it('hides tooltip when buttons are enabled', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.setProps({ modelValue: '{"a": 1}' })
    await wrapper.vm.$nextTick()

    const tooltips = wrapper.findAll('.tooltip')
    expect(tooltips.length).toBe(0)
  })

  it('has title attribute on disabled buttons', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    const formatBtn = wrapper.find('.btn-primary')
    const minifyBtn = wrapper.find('.btn-secondary')

    expect(formatBtn.attributes('title')).toBe('请先输入有效的 JSON')
    expect(minifyBtn.attributes('title')).toBe('请先输入有效的 JSON')
  })

  it('clears title attribute when buttons become enabled', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.setProps({ modelValue: '{"a": 1}' })
    await wrapper.vm.$nextTick()

    const formatBtn = wrapper.find('.btn-primary')
    const minifyBtn = wrapper.find('.btn-secondary')

    expect(formatBtn.attributes('title')).toBeFalsy()
    expect(minifyBtn.attributes('title')).toBeFalsy()
  })

  it('shows success status for valid JSON', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.setProps({ modelValue: '{"a": 1}' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.status-success').exists()).toBe(true)
    expect(wrapper.find('.status-success').text()).toContain('JSON 有效')
  })

  it('shows error status with line number for invalid JSON', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.setProps({ modelValue: '{\n  "a": 1\n  bad\n}' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.status-error').exists()).toBe(true)
    expect(wrapper.find('.status-error').text()).toContain('第 3 行')
  })

  it('formats JSON when format button is clicked', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: '{"a":1,"b":2}'
      }
    })

    await wrapper.vm.$nextTick()

    const formatBtn = wrapper.find('.btn-primary')
    await formatBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted[emitted.length - 1][0]).toContain('\n')
    expect(emitted[emitted.length - 1][0]).toContain('    "a": 1')
  })

  it('minifies JSON when minify button is clicked', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: '{\n  "a": 1,\n  "b": 2\n}'
      }
    })

    await wrapper.vm.$nextTick()

    const minifyBtn = wrapper.find('.btn-secondary')
    await minifyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    const result = emitted[emitted.length - 1][0]
    expect(result).toBe('{"a":1,"b":2}')
    expect(result).not.toMatch(/\s/)
  })

  it('clears textarea when clear button is clicked', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: '{"a": 1}'
      }
    })

    await wrapper.vm.$nextTick()

    const clearBtn = wrapper.find('.btn-ghost')
    await clearBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted[emitted.length - 1][0]).toBe('')
  })

  it('emits validate event with null for valid JSON', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: '{"a": 1}'
      }
    })

    await wrapper.vm.$nextTick()

    const validateEvents = wrapper.emitted('validate')
    expect(validateEvents).toBeDefined()
    expect(validateEvents[validateEvents.length - 1][0]).toBeNull()
  })

  it('emits validate event with error object for invalid JSON', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: '{bad}'
      }
    })

    await wrapper.vm.$nextTick()

    const validateEvents = wrapper.emitted('validate')
    expect(validateEvents).toBeDefined()
    const error = validateEvents[validateEvents.length - 1][0]
    expect(error).toBeInstanceOf(Object)
    expect(error).toHaveProperty('line')
    expect(error).toHaveProperty('column')
  })
})
