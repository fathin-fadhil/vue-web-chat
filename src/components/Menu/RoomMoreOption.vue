<script setup>
import ThreeDot from '../icons/ThreeDot.vue';
import { ref } from "@vue/reactivity";
import { useAuthStore } from '../../stores/auth.store';
import Plus from '../icons/Plus.vue';
import Search from '../icons/Search.vue';

const emits = defineEmits(['browseClick', 'newRoomClick'])

const moreOptionDropdown = ref(false)

function close() {
 setTimeout(() => {
  moreOptionDropdown.value = false;
 }, 300); 
}
</script>

<template>
  <div class="relative z-30">
    <button @click="moreOptionDropdown = !moreOptionDropdown" @blur="close" class="  text-text dark:text-text-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300 p-2">
      <ThreeDot class=" w-6 h-6 text-text dark:text-text-dark" />
    </button>
    <Transition name="slide" >
      <ul v-if="moreOptionDropdown" class=" text-sm w-max shadow-lg transition-all origin-top top-12 duration-300 ease-in-out rounded-xl py-2 absolute right-0 bg-white dark:bg-secondary-dark font-semibold">
        <li class=" dark:hover:bg-white/10 hover:bg-black/10 transition-colors duration-300">
          <button @click="emits('browseClick')" class=" flex gap-2 items-center py-2 px-4" >
            <Search class=" w-5 h-5" />
            Browse Room
          </button>
        </li>
        <li class=" dark:hover:bg-white/10 hover:bg-black/10 transition-colors duration-300">
          <button class=" flex gap-2 items-center py-2 px-4" >
            <Plus />
            Create New Room
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>


.slide-enter-from,
.slide-leave-to {
  transform: scaleY(0%);
}
</style>