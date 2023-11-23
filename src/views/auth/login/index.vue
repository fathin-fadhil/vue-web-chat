<script setup>
import { useAuthStore } from "../../../stores/auth.store"
import { ref } from "@vue/reactivity";
import PrimaryButton from '../../../components/Button/Primary.vue'
import Moon from '../../../components/icons/Moon.vue'
import Sun from '../../../components/icons/Sun.vue'
import { useThemeStore } from '../../../stores/theme.store'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const username = ref('')

function login() {
  authStore.login(username.value)
}
</script>

<template>
  <div class=" min-h-[100dvh] w-full grid place-items-center p-4 relative ">
    <button @click="themeStore.toggleTheme" class=" absolute top-4 right-4 p-4 text-primary dark:text-primary-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300">
      <Sun v-if="themeStore.isDarkTheme" class=" w-7 h-7"></Sun>
      <Moon v-else class=" w-7 h-7"></Moon>
    </button>
    <div class=" w-full flex flex-col items-center justify-center gap-8">
      <div class=" flex justify-center items-center w-full flex-col">
        <img src="/logo.png" alt="logo image" class=" aspect-square w-24">
        <h1 class=" font-bold text-3xl">WebChat</h1>
      </div>
      <main class=" p-4 rounded-xl bg-secondary  dark:bg-secondary-dark w-full max-w-lg">
        <form @submit.prevent="login" class=" flex flex-col justify-center gap-4">
          <p class="text-center font-semibold">Enter your Username or create a new one.</p>
          <div class="relative">
            <input v-model="username" type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2  border-primary appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-1 ring-0 ring-teal-500 focus:border-teal-600 peer" placeholder=" " />
            <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 transition-all font-semibold transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-secondary dark:bg-secondary-dark px-2 peer-focus:px-2 peer-focus:text-teal-600 peer-focus:dark:text-teal-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Username</label>
          </div>
          <div class="w-full flex justify-center">
            <PrimaryButton type="submit">Enter</PrimaryButton>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>