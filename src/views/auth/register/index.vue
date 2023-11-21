<script setup>
import { useAuthStore } from "@/stores/auth.store.js"
import PrimaryButton from "../../../components/Button/Primary.vue";
import { reactive } from "@vue/reactivity";
import { useThemeStore } from '../../../stores/theme.store'
import Moon from '../../../components/icons/Moon.vue'
import Sun from '../../../components/icons/Sun.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

async function register() {
  await authStore.register(formData)
}
</script>


<template>
   <div class=" min-h-screen w-full grid place-items-center p-4 relative ">
      <button @click="themeStore.toggleTheme" class=" absolute top-4 right-4 p-4 text-primary dark:text-primary-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300">
        <Sun v-if="themeStore.isDarkTheme" class=" w-7 h-7"></Sun>
        <Moon v-else class=" w-7 h-7"></Moon>
      </button>

      <main class=" p-4 rounded-xl bg-secondary/40 dark:bg-white/5 w-full max-w-2xl">
        <form action="" @submit.prevent="register">
          <div class="mb-6">
              <label for="name" class="block mb-2 text-sm font-semibold ">Name</label>
              <input v-model="formData.name" type="name" id="name" class="transition-all duration-300 bg-gray-50 border-2 border-gray-200  text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-teal-500/5 dark:border-gray-600/20 dark:placeholder-gray-400  dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="John Doe" required>
          </div>
          <div class="mb-6">
              <label for="email" class="block mb-2 text-sm font-semibold ">Email address</label>
              <input v-model="formData.email" type="email" id="email" class="transition-all duration-300 bg-gray-50 border-2 border-gray-200  text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-teal-500/5 dark:border-gray-600/20 dark:placeholder-gray-400  dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="john.doe@company.com" required>
          </div>
          <div class="mb-6">
              <label for="password" class="block mb-2 text-sm font-semibold ">Password</label>
              <input v-model="formData.password" type="password" id="password" class="transition-all duration-300 bg-gray-50 border-2 border-gray-200  text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-teal-500/5 dark:border-gray-600/20 dark:placeholder-gray-400  dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="********" required>
          </div>
          <div class="mb-6">
              <label for="password_confirmation" class="block mb-2 text-sm font-semibold ">Confirm Password</label>
              <input v-model="formData.passwordConfirmation" type="password" id="password_confirmation" class="transition-all duration-300 bg-gray-50 border-2 border-gray-200  text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-teal-500/5 dark:border-gray-600/20 dark:placeholder-gray-400  dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="********" required>
          </div>
          <p class=" text-sm mb-6">Already have an account? <router-link class=" text-teal-600 hover:underline" to="/login">Login</router-link></p>
          <PrimaryButton :type="'submit'">
            Register
          </PrimaryButton>
        </form>
      </main>
  </div>
</template>

