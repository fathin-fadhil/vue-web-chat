
<script setup>
import { ref } from "@vue/reactivity";
import { useRoomStore } from '../../stores/room.store';
import Spinner from '../icons/Spinner.vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});

const roomStore = useRoomStore()

const emits = defineEmits(["toggle"]);

function toggleShow(value) {
  if (isLoading.value) return;
  emits("toggle", value);
}

const isLoading = ref(false)
const newRoomName = ref('')
const serverResponse = ref('')

async function handleNewRoom() {
  if (!newRoomName.value) return;
  isLoading.value = true
  try {
    await roomStore.createNewRoom(newRoomName.value)    
    newRoomName.value = ''
    emits("toggle", false)
    serverResponse.value = ''
  } catch (error) {
    serverResponse.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <transition name="fade" appear>
    <div class="modal-overlay" v-if="showModal" @click="toggleShow(false)" ></div>
  </transition>
  <transition name="pop" appear>
    <div v-if="showModal" class="modal px-4 max-w-lg w-full h-fit">
      <form @submit.prevent="handleNewRoom" class="flex flex-col overflow-auto backdrop-blur-lg h-full bg-white/80 dark:bg-[#1f423a]/50 rounded-2xl" role="dialog" >
        <section class=" grow px-8 pt-6 pb-4 flex flex-col justify-start gap-2">
          <h1 class="font-bold text-2xl shrink-0 mb-2">Create New Room</h1>
          <div>
            <label for="newroom" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Room Name</label>
            <input id="newroom" type="text" v-model="newRoomName" class=" p-2 bg-white/60 dark:bg-[rgb(15,23,17)]/70 focus:ring-1 ring-teal-500/50 w-full rounded-xl text-base" placeholder="Room Name">
          </div> 
          <p class="text-red-500 text-xs">{{ serverResponse }}</p>
        </section>
        <section class=" shrink-0 flex border-t-[1px] border-accent/40 text-sm">
          <button type="button" @click="toggleShow(false)" class=" border-r-[1px] text-red-500 transition-colors duration-300 hover:bg-black/20 grow font-semibold w-1 p-4 border-accent/40">Cancel</button>
          <button type="submit" :class="isLoading ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-blue-500 hover:bg-black/20 '" class="   transition-colors duration-300  grow font-semibold p-4 w-1 border-accent/40">
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <Spinner class="w-5 h-5" />
              Loading
            </span>
            <span v-else>Create</span>
          </button>
        </section>
      </form>
    </div>
  </transition>
</template>

<style scoped>
.button {
  border: none;
  color: #fff;
  background: #42b983;
  appearance: none;
  font: inherit;
  font-size: 1.8rem;
  padding: 0.5em 1em;
  border-radius: 0.3em;
  cursor: pointer;
}

.modal {
  position: absolute;
  position: fixed;
  inset: 0;
  margin: auto;
  z-index: 999;
  transform: none;
}
.modal-overlay {
  content: "";
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.18);
  z-index: 998;
  backdrop-filter: blur(5px);
  cursor: pointer;
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>

