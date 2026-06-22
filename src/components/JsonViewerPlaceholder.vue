<template>
  <div class="placeholder">
    <div class="placeholder-header">
      <h3 class="placeholder-title">JSON 预览</h3>
    </div>
    <div class="placeholder-body">
      <div class="placeholder-content">
        <div class="placeholder-icon">👁️</div>
        <p class="placeholder-text">预览占位区域</p>
        <p class="placeholder-desc">右侧格式化/树形展示区</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 520px;
}

.placeholder-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.placeholder-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.placeholder-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.placeholder-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
