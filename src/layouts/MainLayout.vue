<template>  
  <div class=" overflow-hidden">
    <slot />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store.js"

const authStore = useAuthStore()
</script>
