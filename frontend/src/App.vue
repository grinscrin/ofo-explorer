<script lang="ts">
import { NConfigProvider, NLoadingBarProvider, NMessageProvider, darkTheme } from 'naive-ui';
import Explorer from './views/Explorer.vue';

export default {
  name: 'App',
  components: {
    NConfigProvider,
    NLoadingBarProvider,
    NMessageProvider,
    Explorer
  },
  setup() {
    return {
      darkTheme
    };
  }
};
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <NLoadingBarProvider>
      <NMessageProvider>
        <div class="app-container">
          <Explorer />
        </div>
      </NMessageProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
</style>