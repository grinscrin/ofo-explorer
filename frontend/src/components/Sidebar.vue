<template>
  <div class="sidebar">
    <div class="section-header">Folders</div>
    <div class="folder-tree-container">
      <NTree
        :data="tree"
        key-field="id"
        label-field="name"
        children-field="children"
        :expandable="isExpandable"
        selectable
        @update:selected-keys="handleSelect"
        @update:expanded-keys="handleExpand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTree } from 'naive-ui';

defineProps({
  tree: Array,
  selectedFolderId: Number,
});

const emit = defineEmits(['select-folder', 'expand-folder']);

function isExpandable(node: { hasChildren?: boolean }): boolean {
  return node.hasChildren === true;
}

function handleSelect(keys: number[]) {
  if (keys.length > 0) {
    emit('select-folder', keys[0]);
  }
}

function handleExpand(keys: number[]) {
  const expandedKey = keys[keys.length - 1];
  if (expandedKey) {
    emit('expand-folder', expandedKey);
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  background-color: #222;
  border-right: 1px solid #333;
  overflow: hidden;
}

.section-header {
  padding: 10px 15px;
  font-size: 13px;
  font-weight: 500;
  color: #999;
  background-color: #262626;
  border-bottom: 1px solid #333;
}

.folder-tree-container {
  flex: 1;
  overflow: auto;
  padding: 5px;
}
</style>
