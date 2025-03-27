<template>
  <div class="toolbar">
    <div class="toolbar-group">
      <button class="toolbar-btn" @click="$emit('refresh')" :disabled="searchActive">
        <RefreshIcon />
        Refresh
      </button>
    </div>
    <div class="search-container">
      <div class="search-wrapper">
        <input
          type="text"
          class="search-input"
          :class="{ 'error': searchError }"
          placeholder="Search files and folders"
          :value="searchQuery"
          @input="handleSearchInput"
          @keyup.enter="handleSearchClick"
          @keyup.esc="handleClearSearch"
        />
        <button 
          v-if="searchQuery"
          class="clear-btn"
          @click="handleClearSearch"
          title="Clear search"
        >×</button>
      </div>
      <button 
        class="search-btn" 
        @click="handleSearchClick"
        :disabled="!searchQuery?.trim()"
      >
        <SearchIcon />
      </button>
    </div>
    <div v-if="searchError" class="search-error">
      {{ searchError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import RefreshIcon from './icons/RefreshIcon.vue';
import SearchIcon from './icons/SearchIcon.vue';

const props = defineProps({
  searchQuery: String,
  searchError: String,
  searchActive: Boolean,
});

const emit = defineEmits(['refresh', 'search', 'update:search-query', 'clear-search']);

// Remove the watch and debounce since we want immediate search
function handleSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit('update:search-query', value);
}

function handleSearchClick() {
  const query = props.searchQuery?.trim();
  if (query) {
    emit('search');
  }
}

function handleClearSearch() {
  emit('update:search-query', '');
  emit('clear-search');
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background-color: #262626;
  border-bottom: 1px solid #333;
}

.toolbar-group {
  display: flex;
  margin-right: 15px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: transparent;
  border: 1px solid #444;
  border-radius: 4px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toolbar-btn:hover:not(:disabled) {
  background-color: #333;
}

.search-container {
  display: flex;
  margin-left: auto;
}

.search-input {
  padding: 5px 10px;
  border: 1px solid #444;
  border-radius: 4px 0 0 4px;
  background-color: #333;
  color: #e0e0e0;
  font-size: 14px;
  width: 200px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  background-color: #444;
  border: 1px solid #444;
  border-left: none;
  border-radius: 0 4px 4px 0;
  color: #ccc;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #555;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.clear-btn:hover {
  color: #fff;
}

.search-input.error {
  border-color: #ff4444;
}

.search-error {
  position: absolute;
  top: 100%;
  right: 15px;
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
}
</style>
