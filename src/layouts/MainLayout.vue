<template>
  <div class="w-screen h-[75px] bg-blue-200 flex justify-center items-center">
    <router-link to="/" class="link">Home</router-link>
    <router-link to="/user" class="link">User</router-link>
    <div class="link" @click="authStore.logout()">Logout</div>
  </div>
  <div class="p-5">
    <slot />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store.js"

const authStore = useAuthStore()
</script>
