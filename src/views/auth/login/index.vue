<script setup>
import { useAuthStore } from "../../../stores/auth.store"
import { reactive } from "@vue/reactivity";
import PrimaryButton from '../../../components/Button/Primary.vue'
import Moon from '../../../components/icons/Moon.vue'
import Sun from '../../../components/icons/Sun.vue'
import { useThemeStore } from '../../../stores/theme.store'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const formData =  reactive({
  email: "",
  password: "",
})

function login() {
  authStore.login(formData)
}

</script>


<template>
  <div class=" min-h-screen w-full grid place-items-center p-4 relative ">
    <button @click="themeStore.toggleTheme" class=" absolute top-4 right-4 p-4 text-primary dark:text-primary-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300">
      <Sun v-if="themeStore.isDarkTheme" class=" w-7 h-7"></Sun>
      <Moon v-else class=" w-7 h-7"></Moon>
    </button>
    <main class=" p-4 rounded-xl bg-secondary/40 dark:bg-white/5 w-full max-w-2xl">
      <form>
        <div class="mb-6">
          <label for="email" class="block mb-2 text-sm font-semibold">Your email</label>
          <input type="email" id="email" class=" transition-all duration-300 bg-gray-50 border-2 border-gray-200  text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-teal-500/5 dark:border-gray-600/20 dark:placeholder-gray-400  dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="name@example.com" required>
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm font-semibold">Your password</label>
          <input type="password" id="password" class=" transition-all duration-300 bg-gray-50 border-2 border-gray-200  text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-teal-500/5 dark:border-gray-600/20 dark:placeholder-gray-400  dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="*********" required>
        </div>
        <p class=" text-sm mb-6">Don't have an account? <router-link class=" text-teal-600 hover:underline" to="/register">Register</router-link></p>
        <PrimaryButton @click="$router.push('/')">Login</PrimaryButton>
      </form>
    </main>
  </div>
</template>