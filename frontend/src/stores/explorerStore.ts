import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFolderTree, getFolderContents, searchFolders, type Folder, type FolderContent } from '../services/api';

export const useExplorerStore = defineStore('explorer', () => {
  // State
  const folderTree = ref<Folder[]>([]);
  const folderContents = ref<FolderContent>({ folders: [], files: [] });
  const currentFolderId = ref<number | null>(null);
  const currentFolderName = ref('Home');
  const breadcrumbs = ref<Folder[]>([]);
  const treeLoading = ref(true);
  const contentsLoading = ref(true);
  const searchQuery = ref('');
  const searchActive = ref(false);
  const searchError = ref<string | null>(null);

  // Computed
  const folderCount = computed(() => folderContents.value.folders.length);
  const fileCount = computed(() => folderContents.value.files.length);
  const totalItems = computed(() => folderCount.value + fileCount.value);

  // Actions
  async function loadFolderTree() {
    treeLoading.value = true;
    contentsLoading.value = true;
    try {
      folderTree.value = await getFolderTree();
      folderTree.value = folderTree.value.map(folder => ({
        ...folder,
        hasChildren: folder.hasChildren || folder.children?.length > 0, // Ensure hasChildren is set
        children: [], // Initialize children as empty
      }));

      // Load root content immediately as part of initial load
      const rootFolderData = await getFolderContents(null);
      folderContents.value = rootFolderData;
    } catch (error) {
      console.error('Error loading folder tree:', error);
    } finally {
      treeLoading.value = false;
      contentsLoading.value = false;
    }
  }

  async function navigateToFolder(folderId: number | null) {
    if (folderId === currentFolderId.value) return;

    contentsLoading.value = true;
    try {
      const folderData = await getFolderContents(folderId);
      folderContents.value = folderData;
      currentFolderId.value = folderId;

      if (folderId === null) {
        currentFolderName.value = 'Home';
        breadcrumbs.value = [];
      } else {
        breadcrumbs.value = folderData.breadcrumb || []; // Ensure breadcrumbs are populated
        currentFolderName.value = folderData.breadcrumb?.[folderData.breadcrumb.length - 1]?.name || 'Unknown';
      }
    } catch (error) {
      console.error(`Error navigating to folder ${folderId}:`, error);
    } finally {
      contentsLoading.value = false;
    }
  }

  async function searchFoldersAndFiles() {
    const trimmedQuery = searchQuery.value.trim();
    
    // Clear search if query is empty
    if (!trimmedQuery) {
      searchActive.value = false;
      searchError.value = null;
      await navigateToFolder(currentFolderId.value);
      return;
    }

    contentsLoading.value = true;
    searchError.value = null;
    searchActive.value = true;

    try {
      const results = await searchFolders(trimmedQuery);
      folderContents.value = results;
      currentFolderName.value = `Search results for "${trimmedQuery}"`;
      breadcrumbs.value = [];
    } catch (error) {
      searchError.value = error instanceof Error ? error.message : 'Search failed';
      console.error('Search error:', error);
    } finally {
      contentsLoading.value = false;
    }
  }

  async function loadFolderChildren(folderId: number) {
    try {
      const folder = folderTree.value.find(f => f.id === folderId);
      if (folder && (!folder.children || folder.children.length === 0)) {
        const folderData = await getFolderContents(folderId);
        folder.children = folderData.folders.map(subfolder => ({
          ...subfolder,
          children: [], // Initialize children as empty
          hasChildren: subfolder.hasChildren || subfolder.children?.length > 0, // Ensure hasChildren is set
        }));
      }
    } catch (error) {
      console.error(`Error loading children for folder ${folderId}:`, error);
    }
  }

  function clearSearch() {
    searchQuery.value = '';
    searchActive.value = false;
    searchError.value = null;
    navigateToFolder(currentFolderId.value);
  }

  return {
    folderTree,
    folderContents,
    currentFolderId,
    currentFolderName,
    breadcrumbs,
    treeLoading,
    contentsLoading,
    searchQuery,
    searchActive,
    searchError,
    folderCount,
    fileCount,
    totalItems,
    loadFolderTree,
    navigateToFolder,
    searchFoldersAndFiles,
    loadFolderChildren,
    clearSearch,
  };
});
