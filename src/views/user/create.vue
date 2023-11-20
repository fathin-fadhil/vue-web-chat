<template>
  <div class="flex justify-between items-center">
    <h1 class="font-semibold text-lg">Add User Page</h1>

  </div>

  <form action="" @submit.prevent="create">
    <div class="mb-6">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Name <span class="text-red-600">*</span></label>
        <input v-model="formData.name" type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required>
    </div>
    <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email address <span class="text-red-600">*</span></label>
        <input v-model="formData.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="john.doe@company.com" required>
    </div>
    <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password <span class="text-red-600">*</span></label>
        <input v-model="formData.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required>
    </div>
    <ButtonPrimary :type="'submit'">
      Submit
    </ButtonPrimary>
    <ButtonDanger @click="$router.push('/user')" class="ml-3">
      Cancel
    </ButtonDanger>
  </form>
</template>

<script>
  import {
    useUserStore
  } from "@/stores/user.store.js"

  export default {
    data() {
      return {
        userStore: useUserStore(),
        formData: {
          name: null,
          email: null,
          password: null,
        }
      }
    },
    methods: {
      async create(){
        let user = await this.userStore.add(this.formData)

        if(user){
          this.$router.push('/user')
        }
      }
    }
  }

</script>
