import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeNode from '@/components/TreeNode.vue'

describe('TreeNode.vue', () => {
  it('renders primitive string value correctly', () => {
    const wrapper = mount(TreeNode, {
      props: {
        keyName: 'msg',
        value: 'hello'
      }
    })
    expect(wrapper.find('.node-key').text()).toBe('msg')
    expect(wrapper.find('.node-value').text()).toBe('"hello"')
    expect(wrapper.find('.node-value').classes()).toContain('type-string')
  })

  it('renders number value correctly', () => {
    const wrapper = mount(TreeNode, {
      props: {
        keyName: 'count',
        value: 42
      }
    })
    expect(wrapper.find('.node-value').text()).toBe('42')
    expect(wrapper.find('.node-value').classes()).toContain('type-number')
  })

  it('renders boolean value correctly', () => {
    const wrapper = mount(TreeNode, {
      props: {
        keyName: 'active',
        value: true
      }
    })
    expect(wrapper.find('.node-value').text()).toBe('true')
    expect(wrapper.find('.node-value').classes()).toContain('type-boolean')
  })

  it('renders null value correctly', () => {
    const wrapper = mount(TreeNode, {
      props: {
        keyName: 'score',
        value: null
      }
    })
    expect(wrapper.find('.node-value').text()).toBe('null')
    expect(wrapper.find('.node-value').classes()).toContain('type-null')
  })

  it('initially shows only first 20 items for array with 101 elements', async () => {
    const arr = Array.from({ length: 101 }, (_, i) => i)
    const wrapper = mount(TreeNode, {
      props: {
        value: arr,
        isRoot: true
      }
    })

    await wrapper.vm.$nextTick()

    const childNodes = wrapper.findAllComponents(TreeNode)
    expect(childNodes.length).toBe(20)

    const moreRow = wrapper.find('.node-more-row')
    expect(moreRow.exists()).toBe(true)
    expect(moreRow.text()).toContain('还有 81 项')
  })

  it('shows "还有 N 项..." with correct count for large array', async () => {
    const arr = Array.from({ length: 150 }, (_, i) => i)
    const wrapper = mount(TreeNode, {
      props: {
        value: arr,
        isRoot: true
      }
    })

    await wrapper.vm.$nextTick()

    const moreRow = wrapper.find('.node-more')
    expect(moreRow.exists()).toBe(true)
    expect(moreRow.text()).toContain('还有 130 项')
  })

  it('shows all items after clicking "还有 N 项..."', async () => {
    const arr = Array.from({ length: 101 }, (_, i) => i)
    const wrapper = mount(TreeNode, {
      props: {
        value: arr,
        isRoot: true
      }
    })

    await wrapper.vm.$nextTick()

    const moreRow = wrapper.find('.node-more-row')
    await moreRow.trigger('click')
    await wrapper.vm.$nextTick()

    const childNodes = wrapper.findAllComponents(TreeNode)
    expect(childNodes.length).toBe(101)
    expect(wrapper.find('.node-more-row').exists()).toBe(false)
  })

  it('does not show "还有 N 项" for small arrays (<=20 items)', async () => {
    const arr = Array.from({ length: 15 }, (_, i) => i)
    const wrapper = mount(TreeNode, {
      props: {
        value: arr,
        isRoot: true
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.node-more-row').exists()).toBe(false)
    const childNodes = wrapper.findAllComponents(TreeNode)
    expect(childNodes.length).toBe(15)
  })

  it('renders object with many keys correctly (limit to 20 initially)', async () => {
    const obj = {}
    for (let i = 0; i < 101; i++) {
      obj[`key${i}`] = i
    }
    const wrapper = mount(TreeNode, {
      props: {
        value: obj,
        isRoot: true
      }
    })

    await wrapper.vm.$nextTick()

    const childNodes = wrapper.findAllComponents(TreeNode)
    expect(childNodes.length).toBe(20)

    const moreRow = wrapper.find('.node-more-row')
    expect(moreRow.exists()).toBe(true)
    expect(moreRow.text()).toContain('还有 81 项')
  })

  it('collapses and expands on toggle click', async () => {
    const arr = [1, 2, 3]
    const wrapper = mount(TreeNode, {
      props: {
        value: arr,
        isRoot: true
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.toggle-btn').classes()).toContain('expanded')
    expect(wrapper.findAllComponents(TreeNode).length).toBe(3)

    await wrapper.find('.node-row').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.toggle-btn').classes()).not.toContain('expanded')
    expect(wrapper.findAllComponents(TreeNode).length).toBe(0)

    await wrapper.find('.node-row').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.toggle-btn').classes()).toContain('expanded')
    expect(wrapper.findAllComponents(TreeNode).length).toBe(3)
  })

  it('applies correct type color classes', () => {
    const wrapper = mount(TreeNode, {
      props: {
        value: {
          str: 'hello',
          num: 42,
          bool: true,
          nil: null
        },
        isRoot: true
      }
    })

    const values = wrapper.findAll('.node-value')
    expect(values[0].classes()).toContain('type-string')
    expect(values[1].classes()).toContain('type-number')
    expect(values[2].classes()).toContain('type-boolean')
    expect(values[3].classes()).toContain('type-null')
  })
})
