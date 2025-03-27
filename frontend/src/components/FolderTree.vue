<template>
  <div class="folder-tree">
    <NTree
      :data="folderTree"
      key-field="id"
      label-field="name"
      children-field="children"
      :expandable="isExpandable"
      selectable
      @update:selected-keys="handleSelect"
      @update:expanded-keys="handleExpand"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useExplorerStore } from '../stores/explorerStore';
import { NTree } from 'naive-ui';

const explorerStore = useExplorerStore();
const { folderTree } = storeToRefs(explorerStore);
const { navigateToFolder, loadFolderChildren } = explorerStore;

// Determine if a folder is expandable based on the hasChildren property
function isExpandable(node: { hasChildren?: boolean }): boolean {
  return !!node.hasChildren; // Only expandable if the folder has children
}

function handleSelect(keys: number[]) {
  if (keys.length > 0) {
    navigateToFolder(keys[0]);
  }
}

function handleExpand(keys: number[]) {
  const expandedKey = keys[keys.length - 1]; // Get the last expanded key
  if (expandedKey) {
    loadFolderChildren(expandedKey); // Load children for the expanded folder
  }
}
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FolderTree'
});
</script>

<style scoped>
.folder-tree {
  width: 100%;
  height: 100%;
  color: #e0e0e0; /* Light text for dark theme */
}

:deep(.n-tree-node-content) {
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

:deep(.n-tree-node-content:hover) {
  background-color: rgba(255, 255, 255, 0.05); /* Light hover for dark theme */
}

:deep(.n-tree-node-content--selected) {
  background-color: rgba(255, 255, 255, 0.08); /* Light selection for dark theme */
}

:deep(.n-tree-node-content__text) {
  padding: 2px 0;
  font-size: 14px;
  color: #e0e0e0; /* Light text for dark theme */
}

:deep(.n-tree-node-switcher) {
  color: #999; /* Lighter color for tree controls */
}

:deep(.n-tree-node) {
  margin-bottom: 2px;
}
</style>