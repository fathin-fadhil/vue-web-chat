<template>
  <h1 class="font-semibold text-lg">Login Page</h1>
  <form action="" @submit.prevent="login">
    <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email address</label>
        <input v-model="formData.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="john.doe@company.com" required>
    </div>
    <div class="mb-6 bg-background dark:bg-background-dark">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
        <input v-model="formData.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required>
    </div>
    <ButtonPrimary :type="'submit'">
      Login
    </ButtonPrimary>
    <ButtonDanger @click="$router.push('/register')" class="ml-3">
      Register
    </ButtonDanger>
  </form>
  <button @click="toggleDark">dark mode toggle</button>

</template>

<script setup>
import { useAuthStore } from "../../../stores/auth.store"
import { reactive } from "@vue/reactivity";

const authStore = useAuthStore()

const formData =  reactive({
  email: "",
  password: "",
})

function login() {
  authStore.login(formData)
}

function toggleDark() {
  if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
}

</script>
