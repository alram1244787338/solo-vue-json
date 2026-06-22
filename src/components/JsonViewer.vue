<template>
  <div class="json-viewer">
    <div class="viewer-header">
      <h3 class="viewer-title">JSON 预览</h3>
      <div class="viewer-stats" v-if="parsedValue !== null">
        <span class="stat-item">{{ typeLabel }}</span>
        <span v-if="sizeLabel" class="stat-item">{{ sizeLabel }}</span>
      </div>
    </div>

    <div class="viewer-body">
      <div v-if="parsedValue !== null" class="tree-container">
        <TreeNode :value="parsedValue" :is-root="true" />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p class="empty-title">请先输入有效的 JSON</p>
        <p class="empty-desc">
          左侧输入正确的 JSON 后，这里将显示树形结构
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  jsonStr: {
    type: String,
    default: ''
  },
  isValid: {
    type: Boolean,
    default: false
  }
})

const parsedValue = computed(() => {
  if (!props.isValid || props.jsonStr.trim() === '') return null
  try {
    return JSON.parse(props.jsonStr)
  } catch (e) {
    return null
  }
})

const valueType = computed(() => {
  const v = parsedValue.value
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  return typeof v
})

const typeLabel = computed(() => {
  const map = {
    object: '对象',
    array: '数组',
    string: '字符串',
    number: '数字',
    boolean: '布尔值',
    null: 'null'
  }
  return map[valueType.value] || valueType.value
})

const sizeLabel = computed(() => {
  const v = parsedValue.value
  if (valueType.value === 'array') {
    return `${v.length} 项`
  }
  if (valueType.value === 'object') {
    const keys = Object.keys(v)
    return `${keys.length} 个键`
  }
  if (valueType.value === 'string') {
    return `${v.length} 字符`
  }
  return ''
})
</script>

<style scoped>
.json-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 520px;
}

.viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}

.viewer-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.viewer-stats {
  display: flex;
  gap: 8px;
}

.stat-item {
  font-size: 12px;
  color: var(--color-text-muted);
  background: var(--color-bg);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}

.viewer-body {
  flex: 1;
  overflow: auto;
  padding: 16px 20px;
  background: var(--color-code-bg);
}

.tree-container {
  min-height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  text-align: center;
  padding: 24px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
