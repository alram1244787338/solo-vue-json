<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <div class="app-container">
        <div class="layout-grid">
          <aside class="panel panel-left">
            <JsonEditor v-model="jsonText" @validate="onValidate" />
          </aside>

          <section class="panel panel-right">
            <JsonViewer :json-str="jsonText" :is-valid="isValid" />
          </section>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import JsonEditor from '@/components/JsonEditor.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const jsonText = ref('')
const isValid = ref(false)

function onValidate(error) {
  isValid.value = error === null && jsonText.value.trim() !== ''
}

const sampleJson = `{
  "name": "JSON Formatter",
  "version": "1.0.0",
  "features": ["格式化", "压缩", "校验", "树形浏览"],
  "author": {
    "name": "开发者",
    "email": "dev@example.com"
  },
  "active": true,
  "count": 42,
  "score": null
}`

onMounted(() => {
  jsonText.value = sampleJson
})
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: 32px 0;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-height: 520px;
}

@media (max-width: 1024px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
