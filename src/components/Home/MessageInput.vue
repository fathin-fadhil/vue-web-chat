<script setup>
import PaperPlane from '../icons/PaperPlaneSolid.vue'
import Primary from '../Button/Primary.vue'
import { ref } from "@vue/reactivity";
import { useRoomStore } from '../../stores/room.store';
import Spinner from '../icons/Spinner.vue';
import { nextTick, onMounted, watch } from 'vue';

const props = defineProps({
  roomId: {
    type: String,
    required: true
  },
  enterTransDone: {
    type: Boolean
  }
})

const roomStore = useRoomStore()

const newMessage = ref({})
const isLoading = ref(false)
const inputRef = ref()

async function handleNewMessage() {
  if (!newMessage.value[props.roomId] || isLoading.value) return;
  isLoading.value = true

  await roomStore.sendMessageToRoomId(props.roomId, newMessage.value[props.roomId])
  newMessage.value[props.roomId] = ''
  isLoading.value = false

/*   await nextTick()
  inputRef.value.focus() */
}

/* watch([() => props.enterTransDone, () => props.roomId], async () => {
  await nextTick()
  if (props.enterTransDone) inputRef.value.focus()
}) */
</script>

<template>
  <form autocomplete="off" @submit.prevent="handleNewMessage()" class="flex gap-3 w-full h-full">
    <div class=" grow">
      <input ref="inputRef" :disabled="isLoading" v-model="newMessage[roomId]" id="message_input" type="text" class=" p-3 bg-white ring-2 ring-primary placeholder:dark:text-accent-dark/50 placeholder:text-accent/70 dark:bg-secondary-dark/90 w-full rounded-3xl text-base disabled:cursor-not-allowed" placeholder="Message">
    </div>
    <Primary type="submit" class=" shrink-0 !rounded-full !p-2 flex justify-center items-center h-full aspect-square" :class="{'cursor-not-allowed': isLoading}">
      <PaperPlane v-if="!isLoading" class=" w-5 h-5 text-white" />
      <Spinner v-else class="w-5 h-5 fill-primary-dark text-white/10 dark:text-black/20 dark:fill-primary" />
    </Primary>
  </form>
</template>