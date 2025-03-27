<template>
  <div class="folder-contents">
    <!-- Header with folder name -->
    <div class="header">
      <h2 class="title">{{ currentFolderName }}</h2>
    </div>
    
    <!-- Content area -->
    <div class="content">
      <!-- Loading indicator -->
      <div v-if="loading && (!folders.length && !files.length)" class="loading">
        Loading...
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!loading && folders.length === 0 && files.length === 0" class="empty-state">
        <div>This folder is empty</div>
        <div>No items to display</div>
      </div>
      
      <!-- Folder and File Grid -->
      <div v-else class="folder-grid">
        <!-- Folders -->
        <div
          v-for="folder in folders"
          :key="`folder-${folder.id}`"
          class="folder-item"
          @click="selectFolder(folder.id)"
        >
          <div class="item-icon folder-icon">
            <svg viewBox="0 0 24 24" width="40" height="40">
              <path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <div class="item-name">{{ folder.name }}</div>
          <div class="item-info">
            <span class="item-type">Folder</span>
            <span class="item-date">{{ formatDate(folder.createdAt) || '-' }}</span>
          </div>
        </div>
        
        <!-- Files -->
        <div
          v-for="file in files"
          :key="`file-${file.id}`"
          class="folder-item"
        >
          <div class="item-icon file-icon">
            <svg viewBox="0 0 24 24" width="40" height="40">
              <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
          <div class="item-name">{{ file.name }}</div>
          <div class="item-info">
            <span class="item-type">{{ file.type || 'File' }}</span>
            <span class="item-size">{{ formatSize(Number(file.size)) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Folder, File } from '../services/api';

// Props
defineProps<{
  folders: Folder[];
  files: File[];
  loading: boolean;
  currentFolderName: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'select-folder', folderId: number): void;
}>();

// Methods
function selectFolder(folderId: number) {
  emit('select-folder', folderId);
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString();
}
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FolderContents'
});
</script>

<style scoped>
.folder-contents {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #333;
}

.title {
  font-size: 18px;
  font-weight: 500;
  color: #e0e0e0;
  margin: 0;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 15px;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #222;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #333;
}

.folder-item:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
}

.folder-icon {
  color: #f59e0b;
}

.file-icon {
  color: #3b82f6;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
}

.item-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #999;
  width: 100%;
  text-align: center;
}

.item-type, .item-size, .item-date {
  margin-top: 2px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 16px;
  text-align: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
}
</style>