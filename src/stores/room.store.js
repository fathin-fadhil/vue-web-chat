import { defineStore } from "pinia";
import { ref } from "@vue/reactivity";
import useAxiosApiClient from "../helper/useAxiosApiClient";

export const useRoomStore = defineStore('room', () => {
  const axiosApiClient = useAxiosApiClient()

  const rooms = ref(JSON.parse(localStorage.getItem('rooms')) || [])
  const joinedRooms = ref(JSON.parse(localStorage.getItem('joinedRooms')) || [])

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

  function joinRoom(roomId) {
    const roomToBeAdded = rooms.value.find(room => room.id === roomId)
    joinedRooms.value = [...joinedRooms.value, roomToBeAdded]
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
  }

  function exitRoom(roomId) {
    joinedRooms.value = joinedRooms.value.filter(room => room.id !== roomId)
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))   
  }

  function checkAlreadyInRoom(roomId) {
    return joinedRooms.value.find(room => room.id === roomId)
  }

  function resetState() {
    rooms.value = []
    joinedRooms.value = []
  }

  return { rooms, joinedRooms, getRooms, searchRoomByName, joinRoom, exitRoom, checkAlreadyInRoom, searchJoinedRoomByName, resetState }
})