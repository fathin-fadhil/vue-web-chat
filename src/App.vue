<template>
  <div id="app">
    <component :is="layout">
      <RouterView />
    </component>
  </div>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue';
export default {
  name: 'App',
  computed: {
    layout() {
      return this.$route.meta.layout || DefaultLayout;
    },
  },
};
</script>
