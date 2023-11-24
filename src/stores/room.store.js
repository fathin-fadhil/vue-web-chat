import { defineStore } from "pinia";
import { ref } from "@vue/reactivity";
import useAxiosApiClient from "../helper/useAxiosApiClient";
import { useAuthStore } from "./auth.store";

export const useRoomStore = defineStore('room', () => {
  const axiosApiClient = useAxiosApiClient()
  const authStore = useAuthStore()

  const rooms = ref(JSON.parse(localStorage.getItem('rooms')) || [])
  const joinedRooms = ref(JSON.parse(localStorage.getItem('joinedRooms')) || [])
  const messagesByRoomId = ref(JSON.parse(localStorage.getItem('messagesByRoomId')) || {})

  async function getRooms() {
    try {
      const res = await axiosApiClient.get('/api/v1/room')
      localStorage.setItem('rooms', JSON.stringify(res.data.data))
      rooms.value = res.data.data
    } catch (error) {
      console.log("🚀 ~ file: index.vue:104 ~ getRooms ~ error:", error)
    }
  }

  function searchRoomByName(searchWord) {
    return rooms.value.filter(room => room.name.toLowerCase().includes(searchWord.toLowerCase()))
  }

  function searchJoinedRoomByName(searchWord) {
    return joinedRooms.value.filter(room => room.name.toLowerCase().includes(searchWord.toLowerCase()))
  }

  async function joinRoom(roomId) {
    const roomToBeAdded = rooms.value.find(room => room.id === roomId)
    joinedRooms.value = [...joinedRooms.value, roomToBeAdded]
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
    await updateMessagesByRoomId(roomId)
  }

  function exitRoom(roomId) {
    joinedRooms.value = joinedRooms.value.filter(room => room.id !== roomId)
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
    delete messagesByRoomId.value[roomId]
    localStorage.setItem('messagesByRoomId', JSON.stringify(messagesByRoomId.value))
  }

  function checkAlreadyInRoom(roomId) {
    return joinedRooms.value.find(room => room.id === roomId)
  }

  async function sendMessageToRoomId(roomId, message) {
    console.log(roomId, message)
    try {
      const res = await axiosApiClient.post('/api/v1/message', {
        room_id: roomId,
        user_name: authStore.username,
        message: message,
      })
      await updateMessagesByRoomId(roomId)
    } catch (error) {
      console.log("🚀 ~ file: room.store.js:65 ~ sendMessageToRoomId ~ error:", error)      
    }
  }

  function resetState() {
    rooms.value = []
    joinedRooms.value = []
  }

  async function updateMessagesByRoomId(roomId) {
    try {
      const res = await axiosApiClient.get(`api/v1/room/${roomId}`)
      messagesByRoomId.value[roomId] = res.data.data.messages
      localStorage.setItem('messagesByRoomId', JSON.stringify(messagesByRoomId.value))
    } catch (error) {
      console.log("🚀 ~ file: room.store.js:39 ~ joinRoom ~ error:", error)
    }
  }

  return { rooms, joinedRooms, getRooms, searchRoomByName, joinRoom, sendMessageToRoomId, exitRoom, checkAlreadyInRoom, searchJoinedRoomByName, resetState, messagesByRoomId }
})