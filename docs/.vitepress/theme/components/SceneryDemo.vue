<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { DemoId } from '../../demos/types';

defineProps<{
  demo: DemoId;
  width?: number;
  height?: number;
}>();

const SceneryDemoInner = defineAsyncComponent( () => import( './SceneryDemoInner.vue' ) );
</script>

<template>
  <ClientOnly>
    <SceneryDemoInner :demo="demo" :width="width" :height="height" />
    <template #fallback>
      <div class="scenery-demo-fallback" role="status">
        <p class="scenery-demo-fallback__label">Interactive demo</p>
        <p>Loading interactive demo…</p>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.scenery-demo-fallback {
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  gap: 0.25rem;
  height: 120px;
  justify-content: center;
  margin: 1rem 0;
}

.scenery-demo-fallback__label {
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}
</style>
