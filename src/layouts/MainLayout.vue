<template>  
  <div class=" overflow-hidden">
    <slot />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store.js"
import { onMounted, onUnmounted } from "vue";
import { useThemeStore } from "../stores/theme.store";

const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.registerResizeListener()
})

onUnmounted(() => {
  themeStore.unregisterResizeListener()
})
</script>
