<template>
  <h1 class="font-semibold text-lg">Register Page</h1>
  <form action="" @submit.prevent="register">
    <div class="mb-6">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
        <input v-model="formData.name" type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required>
    </div>
    <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email address</label>
        <input v-model="formData.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="john.doe@company.com" required>
    </div>
    <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
        <input v-model="formData.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required>
    </div>
    <ButtonPrimary :type="'submit'">
      Register
    </ButtonPrimary>
    <ButtonDanger @click="$router.push('/login')" class="ml-3">
      Login
    </ButtonDanger>
  </form>

</template>

<script>
  import {
    useAuthStore
  } from "@/stores/auth.store.js"

  export default {
    data() {
      return {
        authStore: useAuthStore(),
        formData: {
          name: null,
          email: null,
          password: null,
        }
      }
    },
    methods: {
      async register() {
        await this.authStore.register(this.formData)
      }
    }
  }

</script>
