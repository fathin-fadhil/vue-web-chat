<script setup>
import { getInitials } from '../../helper/userHelper';
import { useAuthStore } from '../../stores/auth.store';
import { formatChatDateString, getTimeString } from "../../helper/timeFormatter";
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import ChevronLeft from '../icons/ChevronLeft.vue';
import Trash from '../icons/Trash.vue'
import { useRoomStore } from '../../stores/room.store'
import ConfirmModal from '../Modal/ConfirmModal.vue'
import ChatBubble from '../icons/ChatBubble.vue'

const authStore = useAuthStore()
const roomStore = useRoomStore()

const props = defineProps({
  messagesData: {
    type: Array,
    required: true
  },
  showTime: {
    type: Boolean,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  chatEvent: {
    type: String,
    required: true
  },
  hasUnread: {
    type: Boolean,
    required: true
  }
})

const messagesParent = ref()
const scrollBottomPos = ref(0)
const deleteConfirmModal = ref(false)
const messageIdToBeDeleted = ref('')
const lastMessageObserver = ref()

watch(() => props.messagesData, () => {
  lastMessageObserver.value?.disconnect()
  lastMessageObserver.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      roomStore.setAsRead(props.roomId)
    }
  }, { threshold: 0.5 })
  lastMessageObserver.value.observe(document.getElementById('last_message'))
}, { flush: 'post' })

watch(() => props.chatEvent, () => {
  if (!props.chatEvent) return
  let scroll = false
  switch (props.chatEvent) {
    case 'message_sent':
      scroll = true
      break;
    case 'new_received_message':
      if (scrollBottomPos.value >= messagesParent.value.scrollHeight - messagesParent.value?.clientHeight / 2) scroll = true
      break;
    default:
      break;
  }
  if (scroll) setTimeout(() => scrollToBottom(), 100)
  roomStore.resetRoomEvent(props.roomId)
}, { flush: 'pre' })

onMounted(() => {
  scrollToBottom()
  messagesParent.value?.addEventListener('scroll', updateScrollPos)
  messagesParent.value.classList.add('scroll-smooth')

})

watch(() => props.roomId, () => {
  scrollToBottom()
  messagesParent.value?.addEventListener('scroll', updateScrollPos)
  messagesParent.value.classList.add('scroll-smooth')
}, { flush: 'post' })

watch(() => props.roomId, () => {
  messagesParent.value.classList.remove('scroll-smooth')
}, {flush: 'pre'})

onUnmounted(() => {
  messagesParent.value?.removeEventListener('scroll', updateScrollPos)
  lastMessageObserver.value?.disconnect()
})

function scrollToBottom() {
  messagesParent.value.scrollTop = messagesParent.value.scrollHeight
  roomStore.setAsRead(props.roomId)
}

function updateScrollPos(ev) {
  scrollBottomPos.value = ev.target.scrollTop + messagesParent?.value?.clientHeight
}

function isTheSameSenderOrDifferentDate(currentMessageObject, messageIndex, fromPreviousMessage = true) {
  const indexShift = fromPreviousMessage ? -1 : 1
  const messageDataToBeCompared = props?.messagesData[messageIndex + indexShift]
  if (fromPreviousMessage && formatChatDateString(currentMessageObject.createdAt) !== formatChatDateString(messageDataToBeCompared?.createdAt)) {
    return false
  }
  return messageDataToBeCompared?.user_name === currentMessageObject.user_name    
}

function isSenderCurrentUser(currentMessageObject) {
  return currentMessageObject.user_name === authStore.username
}
</script>

<template>
  <div id="chat_container" ref="messagesParent" class=" h-full overflow-y-auto overflow-x-hidden flex flex-col relative">
    <div v-if="messagesData.length === 0" class=" flex justify-center items-center h-full" key="empty">
      <div class=" flex flex-col items-center bg-black/ rounded-2xl p-3">
        <ChatBubble class=" w-16 aspect-square text-primary" />  
        <h1 class=" text-xl font-bold text-">Empty Room</h1>
        <p>Send a message to start a conversation</p>
      </div>
    </div>
    <div :class="isTheSameSenderOrDifferentDate(messageData, index, false) ? 'mb-1' : 'mb-4'" v-for="(messageData, index) in messagesData" :key="messageData.id">
      <div v-if="formatChatDateString(messageData.createdAt) !== formatChatDateString(messagesData[index - 1]?.createdAt)" class=" w-fit text-primary dark:text-primary-dark text-xs mx-auto font-black rounded-xl py- px-4 "> 
        {{ formatChatDateString(messageData.createdAt) }} • {{ getTimeString(messageData.createdAt) }} 
      </div>
      <span class=" text-xs font-bold" :class="isSenderCurrentUser(messageData) ? ' text-right w-full block pr-4' : 'pl-14'" v-if="!isTheSameSenderOrDifferentDate(messageData, index)">
        {{ isSenderCurrentUser(messageData) ? '' : messageData.user_name  }}
      </span>
      <div class="flex gap-1">
        <span v-if="!isSenderCurrentUser(messageData)" class=" w-9 h-9 font-bold shrink-0 rounded-full dark:bg-accent-dark text-text-dark bg-accent flex justify-center items-center" :class="isTheSameSenderOrDifferentDate(messageData, index) ? 'opacity-0' : ''">
          {{ getInitials(messageData.user_name) }}
        </span>
        <div onclick class=" w-full gap-2 text-sm font-medium group relative" :class="messageData.user_name === authStore.username ? 'mr-3 flex justify-end' : 'ml-3'">
          <p :id="index === messagesData.length - 1 ? 'last_message' : ''" class=" relative p-2 rounded-xl w-fit max-w-[75%] md:max-w-[68%] lg:max-w-[63%] xl:max-w-[56%] " :class="isSenderCurrentUser(messageData) ? 'bg-secondary dark:bg-primary ' : 'bg-white dark:bg-secondary-dark'">
            {{ messageData.message }}
            <div class=" absolute top-[50%] gap-2 flex justify-center items-center -translate-y-[50%]" :class="isSenderCurrentUser(messageData) ? 'right-[100%] -translate-x-[10px]' : 'left-[100%] translate-x-[10px]'">
              <span class=" text-xs font-bold group-hover:opacity-100 opacity-0 transition-all duration-300" :class="[isSenderCurrentUser(messageData) ? 'translate-x-[40px] group-hover:translate-x-0' : '', {'opacity-100': showTime}]">
                {{ getTimeString(messageData.createdAt) }}
              </span>
              <button @click="() => {messageIdToBeDeleted = messageData.id; deleteConfirmModal = true}" v-if="isSenderCurrentUser(messageData)" class=" text-xs scale-0 block group-hover:scale-100 transition-all duration-300  rounded-lg hover:bg-red-500/10 text-red-500 p-1">
                <Trash class="w-5 h-5" />
              </button>
            </div>
          </p>
          <div v-if="!isTheSameSenderOrDifferentDate(messageData, index)" :class="isSenderCurrentUser(messageData) ? 'bubble-arrow right' : 'bubble-arrow'"></div>
        </div>        
      </div>
    </div>
  </div>
  <button @click="scrollToBottom" :class="scrollBottomPos < messagesParent?.scrollHeight -50 ? 'opacity-100 z-0' : 'opacity-0 -z-50'" class=" fixed grid transition-opacity duration-300 right-4 place-items-center bottom-24 rounded-full w-10 h-10 bg-accent/80">
    <ChevronLeft class=" h-7 w-7 -rotate-90 text-white"  />
  </button>
  <Teleport to="body">
    <ConfirmModal @confirmClick="() => {roomStore.deleteMessage(messageIdToBeDeleted); deleteConfirmModal = false; }" @toggle="(value) => deleteConfirmModal = value " :showModal="deleteConfirmModal" title="Unsend Message" body="Unsend This Message?" confirmText="Unsend" />
  </Teleport>
</template>

<style scoped>
.bubble-arrow {
  position: absolute;
  float: left;
  left: -11px;
  top: 0px;
}

.bubble-arrow::before {
  content: "";
  position: absolute;
  z-index: -1;
  @apply border-t-[25px] border-solid border-white dark:border-t-secondary-dark;
  border-left: 25px solid transparent;
  border-radius: 4px 0 0 0px;
  width: 0;
  height: 0;
}
.bubble-arrow.right {
  /* position: absolute;
  float: left;
  left: -11px;
  top: 0px; */
  right: 11px;
  left: auto;
  float: right;
}

.bubble-arrow.right::before {
  @apply border-t-[25px] border-solid border-t-secondary dark:border-t-primary;
  transform: scaleX(-1);
}
</style>