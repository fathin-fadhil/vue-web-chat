
<script setup>
import ThreeDot from '../icons/ThreeDot.vue';
import { ref } from "@vue/reactivity";
import { useAuthStore } from '../../stores/auth.store';
import Plus from '../icons/Plus.vue';
import Search from '../icons/Search.vue';
import Clock from '../icons/Clock.vue';
import Logout from '../icons/Logout.vue';

const emits = defineEmits(['timeToggleClick', 'exitRoomClick'])

const props = defineProps({
  showTime: {
    type: Boolean,
    required: true
  }
})

const moreOptionDropdown = ref(false)

function close() {
 setTimeout(() => {
  moreOptionDropdown.value = false;
 }, 200); 
}
</script>

<template>
  <div class="relative">
    <button @click="moreOptionDropdown = !moreOptionDropdown" @blur="close" class="  text-text dark:text-text-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300 p-2">
      <ThreeDot class=" w-6 h-6 text-text dark:text-text-dark" />
    </button>
    <Transition name="slide" >
      <ul v-if="moreOptionDropdown" class=" text-sm w-max shadow-lg transition-all origin-top top-12 duration-300 ease-in-out rounded-xl py-2 absolute right-0 bg-white dark:bg-secondary-dark font-semibold">
        <li class=" dark:hover:bg-white/10 hover:bg-black/10 transition-colors duration-300">
          <button @click="emits('timeToggleClick')" class="  flex gap-2 items-center py-2 px-4" >
            <Clock class=" w-5 h-5" />
            {{ showTime ? 'Hide Time' : 'Show Time' }}
          </button>
        </li>
        <li class=" dark:hover:bg-red-500/10 hover:bg-red-500/40 hover:text-red-500 transition-colors duration-300">
          <button @click="emits('exitRoomClick')" class=" flex gap-2 items-center py-2 px-4" >
            <Logout class="h-6 w-6" />
            Exit Room
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