<template>
  <div class="status-bar">
    <div v-if="totalItems > 0">
      {{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}
      ({{ folderCount }} folder{{ folderCount !== 1 ? 's' : '' }},
      {{ fileCount }} file{{ fileCount !== 1 ? 's' : '' }})
    </div>
    <div v-else>Ready</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  folderCount: {
    type: Number,
    required: true,
  },
  fileCount: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.status-bar {
  padding: 6px 15px;
  font-size: 12px;
  background-color: #262626;
  border-top: 1px solid #333;
  color: #999;
}
</style>
