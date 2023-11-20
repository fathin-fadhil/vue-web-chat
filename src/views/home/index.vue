<template>
  <h1 class="font-semibold text-lg">Home Page</h1>
  <h1>{{ counterStore.count }}</h1>
  <button class="bg-blue-400 p-2 rounded-md text-white hover:bg-blue-500"
    @click="counterStore.increment()">Increment</button>
  <button class="bg-blue-400 p-2 rounded-md text-white hover:bg-blue-500 ml-1"
    @click="counterStore.decrement()">Decrement</button>
</template>

<script>
  import {
    useCounterStore
  } from "@/stores/counter.store.js"

  export default {
    data() {
      return {
        counterStore: useCounterStore()
      }
    }
  }

</script>
