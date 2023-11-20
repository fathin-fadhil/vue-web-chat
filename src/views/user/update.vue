<template>
  <div class="flex justify-between items-center">
    <h1 class="font-semibold text-lg">Update User Page</h1>

  </div>

  <form action="" @submit.prevent="update">
    <div class="mb-6">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Name <span class="text-red-600">*</span></label>
        <input v-model="formData.name" type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required>
    </div>
    <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email address <span class="text-red-600">*</span></label>
        <input v-model="formData.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="john.doe@company.com" required>
    </div>
    <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
        <input v-model="formData.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••">
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
    mounted(){
      if(!this.userStore.user){
        this.$router.push('/user')
      }

      this.formData = {
        name: this.userStore.user.name,
        email: this.userStore.user.email,
      }
    },
    methods: {
      async update(){
        let user = await this.userStore.update(this.userStore.user.id, this.formData)

        if(user){
          this.$router.push('/user')
        }
      }
    }
  }

</script>
