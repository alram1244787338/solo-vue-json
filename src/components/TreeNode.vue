<template>
  <div class="tree-node" :class="{ 'is-root': isRoot }">
    <div
      v-if="isExpandable"
      class="node-row"
      @click="toggleExpand"
    >
      <span class="toggle-btn" :class="{ expanded: expanded }">
        ▶
      </span>
      <template v-if="keyName !== null">
        <span class="node-key">{{ keyName }}</span>
        <span class="node-colon">: </span>
      </template>
      <span class="node-bracket">{{ openBracket }}</span>
      <span v-if="!expanded" class="node-summary">
        {{ summary }}
      </span>
      <span v-if="!expanded" class="node-bracket">{{ closeBracket }}</span>
    </div>

    <div
      v-else
      class="node-row node-row-primitive"
    >
      <span class="toggle-btn toggle-placeholder"></span>
      <template v-if="keyName !== null">
        <span class="node-key">{{ keyName }}</span>
        <span class="node-colon">: </span>
      </template>
      <span class="node-value" :class="valueTypeClass">
        {{ displayValue }}
      </span>
    </div>

    <div v-if="isExpandable && expanded" class="node-children">
      <TreeNode
        v-for="(child, index) in children"
        :key="index"
        :key-name="child.key"
        :value="child.value"
        :is-root="false"
      />
    </div>

    <div v-if="isExpandable && expanded" class="node-row node-close-row">
      <span class="toggle-btn toggle-placeholder"></span>
      <span class="node-bracket">{{ closeBracket }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  keyName: {
    type: [String, Number, null],
    default: null
  },
  value: {
    type: [Object, Array, String, Number, Boolean, null],
    default: null
  },
  isRoot: {
    type: Boolean,
    default: false
  }
})

const expanded = ref(true)

const valueType = computed(() => {
  if (props.value === null) return 'null'
  if (Array.isArray(props.value)) return 'array'
  if (typeof props.value === 'object') return 'object'
  return typeof props.value
})

const isExpandable = computed(() => {
  return valueType.value === 'object' || valueType.value === 'array'
})

const valueTypeClass = computed(() => `type-${valueType.value}`)

const openBracket = computed(() => {
  return valueType.value === 'array' ? '[' : '{'
})

const closeBracket = computed(() => {
  return valueType.value === 'array' ? ']' : '}'
})

const children = computed(() => {
  if (valueType.value === 'array') {
    return props.value.map((v, i) => ({ key: i, value: v }))
  }
  if (valueType.value === 'object') {
    return Object.entries(props.value).map(([k, v]) => ({ key: k, value: v }))
  }
  return []
})

const summary = computed(() => {
  if (valueType.value === 'array') {
    const len = props.value.length
    return len === 0 ? '' : `${len} 项`
  }
  if (valueType.value === 'object') {
    const keys = Object.keys(props.value)
    return keys.length === 0 ? '' : `${keys.length} 个键`
  }
  return ''
})

const displayValue = computed(() => {
  const v = props.value
  if (v === null) return 'null'
  if (typeof v === 'string') return `"${v}"`
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (typeof v === 'number') return String(v)
  return ''
})

function toggleExpand() {
  expanded.value = !expanded.value
}

onMounted(() => {
  expanded.value = props.isRoot ? true : children.value.length <= 20
})
</script>

<style scoped>
.tree-node {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
}

.is-root {
  padding: 4px 0;
}

.node-row {
  display: flex;
  align-items: flex-start;
  cursor: default;
  padding: 1px 0;
}

.node-row-primitive {
  cursor: default;
}

.node-row:hover {
  background: rgba(59, 130, 246, 0.04);
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 8px;
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 4px;
  transition: transform 0.15s ease;
  user-select: none;
}

.toggle-btn.expanded {
  transform: rotate(90deg);
}

.toggle-btn:hover {
  color: var(--color-text);
}

.toggle-placeholder {
  visibility: hidden;
  cursor: default;
}

.node-key {
  color: var(--color-key);
  font-weight: 500;
}

.node-colon {
  color: var(--color-text-muted);
}

.node-bracket {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.node-summary {
  color: var(--color-text-muted);
  font-style: italic;
  margin: 0 4px;
  font-size: 12px;
}

.node-value {
  font-weight: 500;
}

.type-string {
  color: var(--color-string);
}

.type-number {
  color: var(--color-number);
}

.type-boolean {
  color: var(--color-boolean);
}

.type-null {
  color: var(--color-null);
  font-style: italic;
}

.node-children {
  padding-left: 22px;
}

.node-close-row {
  cursor: default;
}

.node-close-row:hover {
  background: transparent;
}
</style>
