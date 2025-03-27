<template>
  <div class="explorer">
    <Sidebar
      :tree="folderTree"
      :selected-folder-id="currentFolderId"
      :disabled="searchActive"
      @select-folder="handleSelectFolder"
      @expand-folder="handleExpandFolder"
    />
    <MainContent
      :breadcrumbs="breadcrumbs"
      :folder-contents="folderContents"
      :current-folder-name="currentFolderName"
      :loading="contentsLoading"
      :folder-count="folderCount"
      :file-count="fileCount"
      :total-items="totalItems"
      :search-query="searchQuery"
      :search-error="searchError"
      :search-active="searchActive"
      @refresh="refreshFolder"
      @search="handleSearch"
      @clear-search="clearSearch"
      @update:search-query="searchQuery = $event"
      @navigate="handleNavigate"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useExplorerStore } from '../stores/explorerStore';
import Sidebar from '../components/Sidebar.vue';
import MainContent from '../components/MainContent.vue';

const explorerStore = useExplorerStore();
const {
  folderTree,
  folderContents,
  currentFolderId,
  currentFolderName,
  breadcrumbs,
  searchQuery,
  folderCount,
  fileCount,
  totalItems,
  searchActive,
  searchError,
  contentsLoading,
} = storeToRefs(explorerStore);

const { loadFolderTree, navigateToFolder, searchFoldersAndFiles, loadFolderChildren, clearSearch } = explorerStore;

onMounted(async () => {
  await loadFolderTree();
  await navigateToFolder(null);
});

function handleSelectFolder(folderId: number) {
  navigateToFolder(folderId);
}

function handleExpandFolder(folderId: number) {
  loadFolderChildren(folderId);
}

function handleNavigate(folderId: number | null) {
  navigateToFolder(folderId);
}

function refreshFolder() {
  if (currentFolderId.value !== null) {
    navigateToFolder(currentFolderId.value);
  } else {
    navigateToFolder(null);
  }
}

function handleSearch() {
  searchFoldersAndFiles();
}
</script>

<style scoped>
.explorer {
  display: flex;
  height: 100%;
  width: 100%;
  color: #e0e0e0;
  background-color: #1a1a1a;
}
</style>