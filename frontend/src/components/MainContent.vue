<template>
  <div class="content-area">
    <Breadcrumb :breadcrumbs="breadcrumbs" @navigate="$emit('navigate', $event)" />
    <Toolbar
      :search-query="searchQuery"
      :search-error="searchError"
      :search-active="searchActive"
      @refresh="$emit('refresh')"
      @search="$emit('search')"
      @clear-search="$emit('clear-search')"
      @update:search-query="$emit('update:search-query', $event)"
    />
    <FolderContents
      :folders="folderContents.folders"
      :files="folderContents.files"
      :loading="loading"
      :current-folder-name="currentFolderName"
      @select-folder="$emit('navigate', $event)"
    />
    <StatusBar
      :folder-count="folderCount"
      :file-count="fileCount"
      :total-items="totalItems"
    />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './Breadcrumb.vue';
import Toolbar from './Toolbar.vue';
import FolderContents from './FolderContents.vue';
import StatusBar from './StatusBar.vue';

defineProps({
  breadcrumbs: Array,
  folderContents: Object,
  currentFolderName: String,
  loading: Boolean,
  folderCount: Number,
  fileCount: Number,
  totalItems: Number,
  searchQuery: String,
  searchError: String,
  searchActive: Boolean,
});

defineEmits([
  'refresh',
  'search',
  'navigate',
  'update:search-query',
  'clear-search'
]);
</script>

<style scoped>
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
