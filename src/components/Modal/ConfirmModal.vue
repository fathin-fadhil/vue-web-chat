<script setup>
import { useAuthStore } from '../../stores/auth.store';

defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    required: true
  }
});

const emits = defineEmits(["toggle", "confirmClick"]);
const authStore = useAuthStore()

function toggleShow(value) {
  emits("toggle", value);
}
</script>

<template>
  <transition name="fade" appear>
    <div class="modal-overlay" v-if="showModal" @click="toggleShow(false)" ></div>
  </transition>
  <transition name="pop" appear>
    <div class="modal w-fit z-50 overflow-hidden max-w-lg bg-white/80  dark:bg-neutral-800/50 rounded-2xl h-fit" role="dialog" v-if="showModal">
      <div class=" px-24 py-6 flex flex-col justify-start gap-2">
        <h1 class=" font-bold text-center text-lg">{{ title }}</h1>
        <p class=" text-sm">{{ body }}</p>
      </div>
      <div class=" flex border-t-[1px] border-accent/40 text-sm ">
        <button @click="toggleShow(false)" class=" text-blue-500 grow transition-colors duration-300 hover:bg-black/20  border-r-[1px] font-semibold py-4 w-1 border-accent/40">Cancel</button>
        <button @click="emits('confirmClick')" class=" grow py-4 hover:bg-black/20 text-red-500 font-semibold transition-colors duration-300 w-1">{{ confirmText }}</button>
      </div>
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
  background-color: rgba(0, 0, 0, 0.18);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
