<script setup>
import PaperPlane from '../icons/PaperPlaneSolid.vue'
import Primary from '../Button/Primary.vue'
import { ref } from "@vue/reactivity";
import { useRoomStore } from '../../stores/room.store';
import { useDraftStore } from '../../stores/draft.store';
import { useThemeStore } from "../../stores/theme.store";
import Spinner from '../icons/Spinner.vue';
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import Emoji from '../icons/Emoji.vue'
import 'emoji-picker-element'

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
const draftStore = useDraftStore()
const themeStore = useThemeStore()

const isLoading = ref(false)
const showEmojiPopup = ref(false)
const inputRef = ref()
const emojiPickerRef = ref()

async function handleNewMessage() {
  if (!draftStore.messageDraftByRoomId[props.roomId] || isLoading.value) return;
  isLoading.value = true
  showEmojiPopup.value = false

  await roomStore.sendMessageToRoomId(props.roomId, draftStore.messageDraftByRoomId[props.roomId])
  draftStore.clearRoomDraft(props.roomId)
  isLoading.value = false

/*   await nextTick()
  inputRef.value.focus() */
}

/* watch([() => props.enterTransDone, () => props.roomId], async () => {
  await nextTick()
  if (props.enterTransDone) inputRef.value.focus()
}) */

async function addEmoji(emojiEvent) {
  const cursorPosition = inputRef.value.selectionEnd
  const start = draftStore.messageDraftByRoomId[props.roomId].substring(0, inputRef.value.selectionStart)
  const end = draftStore.messageDraftByRoomId[props.roomId].substring(inputRef.value.selectionStart)
  draftStore.setDraftText(props.roomId, start + emojiEvent.detail.unicode + end)
  inputRef.value.focus()
  await nextTick()
  inputRef.value.selectionEnd = cursorPosition + emojiEvent.detail.unicode.length
}

onMounted(() => {
  emojiPickerRef.value.addEventListener('emoji-click', addEmoji)
  draftStore.messageDraftByRoomId[props.roomId] = ''
})

onBeforeUnmount(() => emojiPickerRef.value.removeEventListener('emoji-click', addEmoji))

watch(() => props.roomId, () => {
  draftStore.messageDraftByRoomId[props.roomId] = draftStore.messageDraftByRoomId[props.roomId] ?? ''
})
</script>

<template>
  <form autocomplete="off" @submit.prevent="handleNewMessage()" class="flex gap-3 w-full h-full">
    <div class=" grow  relative">
      <div :class="!showEmojiPopup && 'scale-y-0'" class="absolute origin-bottom bottom-14 rounded-xl shadow-xl transition-all duration-300 scale-y-100 overflow-hidden">
        <emoji-picker :class="{'dark': themeStore.isDarkTheme}" ref="emojiPickerRef"></emoji-picker>
      </div>
      <button @click="showEmojiPopup = !showEmojiPopup" type="button" class=" rounded-full p-2 absolute translate-x-1 top-[50%] -translate-y-[50%] hover:bg-black/20 dark:hover:bg-white/20">
        <Emoji class=" text-primary w-6 h-6 dark:text-primary-dark" />
      </button>
      <input ref="inputRef" :disabled="isLoading" v-model="draftStore.messageDraftByRoomId[roomId]" id="message_input" type="text" class=" pl-12 p-3 bg-white focus:ring-2 ring-primary dark:ring-primary-dark placeholder:dark:text-accent-dark/50 placeholder:text-accent/70 dark:bg-secondary-dark/90 w-full rounded-3xl text-base disabled:cursor-not-allowed" placeholder="Message">
    </div>
    <Primary type="submit" class=" shrink-0 !rounded-full !p-2 flex justify-center items-center h-full aspect-square" :class="{'cursor-not-allowed': isLoading}">
      <PaperPlane v-if="!isLoading" class=" w-5 h-5 text-white" />
      <Spinner v-else class="w-5 h-5 fill-primary-dark text-white/10 dark:text-black/20 dark:fill-primary" />
    </Primary>
  </form>
</template>