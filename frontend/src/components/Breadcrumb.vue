<template>
  <div class="breadcrumb">
    <div class="breadcrumb-item" @click="$emit('navigate', null)">Home</div>
    <div v-for="item in breadcrumbs" :key="item.id" class="breadcrumb-part">
      <div class="breadcrumb-separator">&gt;</div>
      <div
        class="breadcrumb-item"
        @click="$emit('navigate', item.id)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  breadcrumbs: {
    type: Array,
    required: true,
  },
});

defineEmits(['navigate']);
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #262626;
  border-bottom: 1px solid #333;
  font-size: 14px;
}

.breadcrumb-item {
  cursor: pointer;
  color: #ccc;
}

.breadcrumb-item:hover {
  text-decoration: underline;
  color: #fff;
}

.breadcrumb-part {
  display: flex;
  align-items: center;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #666;
}
</style>
