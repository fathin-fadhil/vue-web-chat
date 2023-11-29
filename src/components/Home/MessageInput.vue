<script setup>
import PaperPlane from '../icons/PaperPlaneSolid.vue'
import Primary from '../Button/Primary.vue'
import { ref } from "@vue/reactivity";
import { useRoomStore } from '../../stores/room.store';

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const roomStore = useRoomStore()

const newMessage = ref('')

function handleNewMessage() {
  roomStore.sendMessageToRoomId(props.roomId, newMessage.value)
  newMessage.value = ''
}
</script>

<template>
  <form autocomplete="off" @submit.prevent="handleNewMessage()" class="flex gap-3 w-full h-full">
    <div class=" grow">
      <input v-model="newMessage" id="message_input" type="text" class=" p-3 bg-white ring-2 ring-primary placeholder:dark:text-accent-dark/50 placeholder:text-accent/70 dark:bg-secondary-dark/90 w-full rounded-3xl text-base" placeholder="Message">
    </div>
    <Primary type="submit" class=" shrink-0 !rounded-full !p-2 flex justify-center items-center h-full aspect-square">
      <PaperPlane class=" w-5 h-5 text-white" />
    </Primary>
  </form>
</template>