<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { getInitials } from '../../helper/userHelper';
import { useAuthStore } from '../../stores/auth.store';
import { formatChatDateString, getTimeString } from "../../helper/timeFormatter";
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import ChevronLeft from '../icons/ChevronLeft.vue';

const [ messagesParent ] = useAutoAnimate()
const authStore = useAuthStore()

const props = defineProps({
  messagesData: {
    type: Array,
    required: true
  },
  showTime: {
    type: Boolean,
    required: true
  }
})

const scrollBottomPos = ref(0)

watch(() => props.messagesData, () => {
  scrollToBottom()
  messagesParent.value.classList.add('scroll-smooth')
}, { flush: 'post' })

watch(() => props.messagesData, () => {
  messagesParent.value.classList.remove('scroll-smooth')
}, {flush: 'pre'})

onMounted(() => {
  scrollToBottom()
  messagesParent.value?.addEventListener('scroll', updateScrollPos)
  messagesParent.value.classList.add('scroll-smooth')
})

onUnmounted(() => {
  messagesParent.value?.removeEventListener('scroll', updateScrollPos)
})

function scrollToBottom() {
  messagesParent.value.scrollTop = messagesParent.value.scrollHeight
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
          <p class=" relative p-2 rounded-xl w-fit max-w-[75%] md:max-w-[68%] lg:max-w-[63%] xl:max-w-[56%] " :class="isSenderCurrentUser(messageData) ? 'bg-secondary dark:bg-primary ' : 'bg-white dark:bg-secondary-dark'">
            {{ messageData.message }}
            <span class=" text-xs font-bold absolute top-[50%] group-hover:opacity-100 opacity-0 transition-opacity duration-300 -translate-y-[50%]" :class="[isSenderCurrentUser(messageData) ? 'right-[100%] -translate-x-[10px]' : 'left-[100%] translate-x-[10px]', {'!opacity-100': showTime}]">
              {{ getTimeString(messageData.createdAt) }}
            </span>
          </p>
          <div v-if="!isTheSameSenderOrDifferentDate(messageData, index)" :class="isSenderCurrentUser(messageData) ? 'bubble-arrow right' : 'bubble-arrow'"></div>
        </div>        
      </div>
    </div>
  </div>
  <button @click="scrollToBottom" :class="scrollBottomPos < messagesParent?.scrollHeight -50 ? 'opacity-100 z-0' : 'opacity-0 -z-50'" class=" fixed grid transition-opacity duration-300 right-4 place-items-center bottom-24 rounded-full w-10 h-10 bg-accent/80">
    <ChevronLeft class=" h-7 w-7 -rotate-90 text-white"  />
  </button>
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