import { defineStore } from "pinia";
import { ref } from "@vue/reactivity";

export const useDraftStore = defineStore('draft', () => {
  const messageDraftByRoomId = ref({})

  function setDraftText(roomId, text) {
    messageDraftByRoomId.value[roomId] = text  
  }

  function clearRoomDraft(roomId) {
    messageDraftByRoomId.value[roomId] = ''
  }

  return { messageDraftByRoomId, setDraftText, clearRoomDraft }
}) 