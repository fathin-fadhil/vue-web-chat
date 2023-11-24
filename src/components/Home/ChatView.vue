<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { getInitials } from '../../helper/userHelper';
import { useAuthStore } from '../../stores/auth.store';
import { getTimeString } from "../../helper/timeFormatter";

const [ messagesParent ] = useAutoAnimate()
const authStore = useAuthStore()

const props = defineProps({
  messagesData: {
    type: Array,
    required: true
  }
})

</script>

<template>
  <div ref="messagesParent" class=" h-full overflow-y-auto overflow-x-hidden flex flex-col">
    <div :class="[messagesData[index + 1]?.user_name === messageData.user_name ? 'mb-1' : 'mb-4']" v-for="(messageData, index) in messagesData" :key="messageData.id">
      <span class=" text-xs font-bold" :class="messageData.user_name !== authStore.username ? 'pl-14' : ' text-right w-full block pr-4'" v-if="getTimeString(messageData.createdAt) !== getTimeString(messagesData[index - 1]?.createdAt)">
        {{ messageData.user_name === authStore.username ? '' : messageData.user_name + '  • ' }} {{ getTimeString(messageData.createdAt) }}
      </span>
      <div class="flex gap-1">
        <span v-if="messageData.user_name !== authStore.username" class=" w-9 h-9 font-bold shrink-0 rounded-full dark:bg-accent-dark text-text-dark bg-accent flex justify-center items-center" :class="messagesData[index - 1]?.user_name === messageData.user_name ? 'opacity-0' : ''">
          {{ getInitials(messageData.user_name) }}
        </span>
        <div class=" w-full text-sm font-medium relative" :class="messageData.user_name === authStore.username ? 'mr-3 flex justify-end' : 'ml-3'">
          <p class=" p-2 rounded-xl w-fit max-w-[75%] md:max-w-[68%] lg:max-w-[63%] xl:max-w-[56%] " :class="messageData.user_name === authStore.username ? 'bg-secondary dark:bg-primary ' : 'bg-white dark:bg-secondary-dark'">
            {{ messageData.message }}
            awfw afwaawfwaf awfawfawf
          </p>
          <div v-if="messagesData[index - 1]?.user_name !== messageData.user_name" :class="messageData.user_name === authStore.username ? 'bubble-arrow right' : 'bubble-arrow'"></div>
        </div>        
      </div>
    </div>
  </div>
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