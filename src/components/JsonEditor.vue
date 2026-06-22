<template>
  <div class="json-editor">
    <div class="editor-header">
      <h3 class="editor-title">JSON 编辑器</h3>
      <div class="editor-actions">
        <span class="tooltip-wrapper">
          <button
            class="btn btn-primary"
            @click="onFormat"
            :disabled="!isValid"
            :title="!isValid ? '请先输入有效的 JSON' : ''"
          >
            格式化
          </button>
          <span v-if="!isValid" class="tooltip">请先输入有效的 JSON</span>
        </span>
        <span class="tooltip-wrapper">
          <button
            class="btn btn-secondary"
            @click="onMinify"
            :disabled="!isValid"
            :title="!isValid ? '请先输入有效的 JSON' : ''"
          >
            压缩
          </button>
          <span v-if="!isValid" class="tooltip">请先输入有效的 JSON</span>
        </span>
        <button class="btn btn-ghost" @click="onClear">
          清空
        </button>
      </div>
    </div>

    <div class="editor-body">
      <textarea
        ref="textareaRef"
        class="editor-textarea"
        :value="modelValue"
        @input="onInput"
        placeholder="在此输入或粘贴 JSON..."
        spellcheck="false"
      ></textarea>
    </div>

    <div class="editor-footer">
      <div v-if="validationError" class="status status-error">
        <span class="status-icon">✕</span>
        <span class="status-text">
          {{ validationError.message }}
          <span v-if="validationError.line" class="status-line">
            (第 {{ validationError.line }} 行)
          </span>
        </span>
      </div>
      <div v-else-if="isValid" class="status status-success">
        <span class="status-icon">✓</span>
        <span class="status-text">JSON 有效</span>
      </div>
      <div v-else class="status status-empty">
        <span class="status-icon">○</span>
        <span class="status-text">等待输入</span>
      </div>
      <div class="char-count">
        {{ modelValue.length }} 字符
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { validate, format, minify } from '@/utils/json.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'validate'])

const textareaRef = ref(null)

const validationError = computed(() => validate(props.modelValue))

const isValid = computed(() => {
  return props.modelValue.trim() !== '' && validationError.value === null
})

watch([() => props.modelValue, validationError], () => {
  emit('validate', validationError.value)
}, { immediate: true })

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function onFormat() {
  if (!isValid.value) return
  try {
    const formatted = format(props.modelValue)
    emit('update:modelValue', formatted)
  } catch (e) {
    // ignore
  }
}

function onMinify() {
  if (!isValid.value) return
  try {
    const minified = minify(props.modelValue)
    emit('update:modelValue', minified)
  } catch (e) {
    // ignore
  }
}

function onClear() {
  emit('update:modelValue', '')
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}
</script>

<style scoped>
.json-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 520px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}

.editor-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.editor-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: #fff;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 10;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--color-text);
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.btn {
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-bg);
  color: var(--color-text);
}

.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 400px;
  padding: 16px 20px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-code-bg);
  border: none;
  resize: none;
  outline: none;
  tab-size: 2;
}

.editor-textarea::placeholder {
  color: var(--color-text-muted);
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid var(--color-border);
  background: #fafbfc;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-icon {
  font-size: 11px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.status-success {
  color: var(--color-success);
}

.status-success .status-icon {
  background: var(--color-success);
  color: #fff;
}

.status-error {
  color: var(--color-danger);
}

.status-error .status-icon {
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
}

.status-line {
  color: var(--color-text-muted);
  font-weight: 400;
}

.status-empty {
  color: var(--color-text-muted);
}

.status-empty .status-icon {
  border: 1.5px solid var(--color-text-muted);
}

.char-count {
  font-size: 12px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}
</style>
