import { defineStore } from "pinia";
import { ref } from "@vue/reactivity";
import useAxiosApiClient from "../helper/useAxiosApiClient";
import { useAuthStore } from "./auth.store";
import { io } from "socket.io-client";
import { computed } from "vue";
import { useKeyStore } from "./key.store";
import { decryptText, decryptWithSymmetricKey, encryptText, encryptWithSymmetricKey, generateSymmetricKey } from "../helper/encryption";

export const useRoomStore = defineStore('room', () => {
  const axiosApiClient = useAxiosApiClient()
  const authStore = useAuthStore()
  const keyStore = useKeyStore()

  const rooms = ref(JSON.parse(localStorage.getItem('rooms')) || [])
  const joinedRooms = ref(JSON.parse(localStorage.getItem('joinedRooms')) || [])
  const messagesByRoomId = ref(JSON.parse(localStorage.getItem('messagesByRoomId')) || {})
  const socketConnection = ref({})
  const sortedJoinedRooms = computed(() => {
    return joinedRooms.value.toSorted((roomA, roomB) => new Date(messagesByRoomId.value[roomB.id].at(-1)?.createdAt || 0) - new Date(messagesByRoomId.value[roomA.id].at(-1)?.createdAt || 0))
  })

  
  async function updateAllJoinedRoomMessages() {
    joinedRooms.value.forEach(async (room) => {
      // await updateMessagesByRoomId(room.id)
      joinRoomWebSocket(room.id)
    })
  }
  
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
    return sortedJoinedRooms.value.filter(room => room.name.toLowerCase().includes(searchWord.toLowerCase()))
  }

  async function joinRoom(roomId) {
    try {
      const res = await axiosApiClient.get(`/api/v1/room/${roomId}`)
      const joinedRoomsObj = res.data.data
      
      messagesByRoomId.value[roomId] = []
      joinedRooms.value = [...joinedRooms.value, joinedRoomsObj]
      //delete joinedRoomsObj.messages

      localStorage.setItem('messagesByRoomId', JSON.stringify(messagesByRoomId.value))
      localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))

      joinRoomWebSocket(roomId)
    } catch (error) {
      console.log("🚀 ~ file: room.store.js:48 ~ joinRoom ~ error:", error)      
    }
  }

  function exitRoom(roomId) {
    joinedRooms.value = joinedRooms.value.filter(room => room.id !== roomId)
    messagesByRoomId.value[roomId] = []
    localStorage.setItem('messagesByRoomId', JSON.stringify(messagesByRoomId.value))
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
    socketConnection.value[roomId].disconnect()
  }

  function exitAllSocketRoom() {
    return new Promise((resolve, reject) => {
      joinedRooms.value.forEach(room => {
        console.log('exitAllSocketRoom', room.id)
        socketConnection.value[room.id].disconnect()
      })      
      resolve()
    })
  }

  function checkAlreadyInRoom(roomId) {
    return joinedRooms.value.find(room => room.id === roomId)
  }

  async function sendMessageToRoomId(roomId, message) {
    try {
      const messageData = {}
      const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
      const usersInRoom = joinedRooms.value[roomIndex].joinedUser

      const symmetricKey = await generateSymmetricKey()
      messageData.encryptedMessageData = await encryptWithSymmetricKey(symmetricKey, message)
      messageData.encryptedKeys = {}
      for (const username in usersInRoom) {
        messageData.encryptedKeys[usersInRoom[username].socket_id] = {
          to: username,
          encryptedKey: await encryptText(usersInRoom[username].public_key, symmetricKey),
        }
      }

      console.log("🚀 ~ file: room.store.js:82 ~ sendMessageToRoomId ~ symmetricKey:", symmetricKey)
      console.log("🚀 ~ file: room.store.js:85 ~ sendMessageToRoomId ~ messageData:", messageData)

      await axiosApiClient.post('/api/v1/message', {
        room_id: roomId,
        user_name: authStore.username,
        messageData: messageData,
        id: Math.random().toString(36).substr(2, 12),
        createdAt: new Date().toISOString(),
      })

      /* const res = await axiosApiClient.post('/api/v1/message', {
        room_id: roomId,
        user_name: authStore.username,
        message: message,
      }) */
    } catch (error) {
      console.log("🚀 ~ file: room.store.js:65 ~ sendMessageToRoomId ~ error:", error)      
    }
  }

  async function deleteMessage(messageId, roomId) {
    try {
      await axiosApiClient.delete(`/api/v1/message/${messageId}?room_id=${roomId}`)
    } catch (error) {
      console.log("🚀 ~ file: room.store.js:81 ~ deleteMessage ~ error:", error)
    }
  }

  async function createNewRoom(newRoomName) {
    return await axiosApiClient.post('/api/v1/room', {
      name: newRoomName
    })
  }

  function setAsRead(roomId) {
    const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
    joinedRooms.value[roomIndex]['hasUnread'] = false
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
  }

  async function resetState() {
    await exitAllSocketRoom()
    rooms.value = []
    joinedRooms.value = []
    messagesByRoomId.value = {}
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

  function resetRoomEvent(roomId) {
    const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
    joinedRooms.value[roomIndex]['event'] = ''
    localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
  }

  function joinRoomWebSocket(roomId){
    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      query: {
        'room_id': roomId,
        'username': authStore.username,
        'public_key': keyStore.publicKey
      }
    })

    newSocket.on('user_joined', (userData) => {
      console.log("user join", userData.username)
      const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
      joinedRooms.value[roomIndex].joinedUser[userData.username] = userData
      //joinedRooms.value[roomIndex].joinedUser[userData.username] = userData
      localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
    })

    newSocket.on('user_left', (userData) => {
      console.log("user left", userData)
      const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
      const newJoinedUser = {...joinedRooms.value[roomIndex].joinedUser}
      delete newJoinedUser[userData.username]
      joinedRooms.value[roomIndex].joinedUser = newJoinedUser
      localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
    })

    newSocket.on('new_message', async (rawMessageData) => {
      const symmetricKey = await decryptText(keyStore.privateKey, rawMessageData.encryptedKey)
      const message = await decryptWithSymmetricKey(symmetricKey, rawMessageData.encryptedMessageData)

      delete rawMessageData.encryptedKey
      delete rawMessageData.encryptedMessageData

      const messageData = {
        ...rawMessageData,
        message: message,
      }

      console.log('parsed data', messageData)

      const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
      messagesByRoomId.value[roomId].push(messageData)
      if (messageData.user_name === authStore.username) {
        joinedRooms.value[roomIndex]['event'] = 'message_sent'
      } else {
        joinedRooms.value[roomIndex]['hasUnread'] = true
        joinedRooms.value[roomIndex]['event'] = 'new_received_message'
      }
      localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
      localStorage.setItem('messagesByRoomId', JSON.stringify(messagesByRoomId.value))
    })

    newSocket.on('delete_message', ({messageId}) => {            
      const roomIndex = joinedRooms.value.findIndex(room => room.id === roomId)
      messagesByRoomId.value[roomId].splice(messagesByRoomId.value[roomId].findIndex(message => message.id === messageId), 1)
      joinedRooms.value[roomIndex]['event'] = 'delete_message'
      localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms.value))
      localStorage.setItem('messagesByRoomId', JSON.stringify(messagesByRoomId.value))
    })

    socketConnection.value[roomId] = newSocket
  }

  return { rooms, joinedRooms, getRooms, searchRoomByName, joinRoom, sendMessageToRoomId, exitRoom, checkAlreadyInRoom, searchJoinedRoomByName, resetState, updateAllJoinedRoomMessages, createNewRoom, deleteMessage, sortedJoinedRooms, setAsRead, resetRoomEvent, messagesByRoomId }
})