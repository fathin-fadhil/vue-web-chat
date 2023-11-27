<script setup>
import { useThemeStore } from "../../stores/theme.store";
import { useRoomStore } from "../../stores/room.store";
import { ref } from "@vue/reactivity";
import Sun from '../../components/icons/Sun.vue';
import Moon from '../../components/icons/Moon.vue';
import Search from '../../components/icons/Search.vue';
import Logout from '../../components/icons/Logout.vue'
import ChevronLeft from '../../components/icons/ChevronLeft.vue';
import PaperPlane from '../../components/icons/PaperPlaneSolid.vue';
import Close from '../../components/icons/Close.vue'
import { onMounted, watch, watchEffect } from 'vue';
import MoreOption from '../../components/Menu/RoomMoreOption.vue'
import { useAuthStore } from "../../stores/auth.store";
import ConfirmModal from "../../components/Modal/ConfirmModal.vue";
import BrowseRoom from "../../components/Modal/BrowseRoom.vue";
import { useAutoAnimate } from "@formkit/auto-animate/vue";
import UsersChat from "../../components/icons/UsersChat.vue";
import Primary from "../../components/Button/Primary.vue";
import { formatTimeString } from '../../helper/timeFormatter'
import ChatView from '../../components/Home/ChatView.vue'
import ChatMoreOption from "../../components/Menu/ChatMoreOption.vue";

const themeStore = useThemeStore()
const authStore = useAuthStore()
const roomStore = useRoomStore()
const [ roomsParent ] = useAutoAnimate()

const selectedRoomObject = ref(null)
const search = ref('')
const filteredRooms = ref(roomStore.searchJoinedRoomByName(search.value))
const newMessage = ref('')
const logoutModal = ref(false)
const showTime = ref(false)
const browseModal = ref(false)
const exitRoomModal = ref(false)

function handleRoomChange(roomObject) {
  if (!selectedRoomObject.value) {
    selectedRoomObject.value = roomObject; 
    window.history.pushState({}, null, null)
  } else {
    selectedRoomObject.value = roomObject; 
  }
}

function handleNewMessage() {
  roomStore.sendMessageToRoomId(selectedRoomObject.value.id, newMessage.value)
  newMessage.value = ''
}

onMounted(() => {
  addEventListener('popstate', () => {
    if (selectedRoomObject.value) {
      selectedRoomObject.value = ''
    }
  })

  if (roomStore.joinedRooms?.length === 0) {
    browseModal.value = true
  }

  roomStore.updateAllJoinedRoomMessages()
})

watch([search, () => roomStore.joinedRooms], () => {
  filteredRooms.value = roomStore.searchJoinedRoomByName(search.value)
})
</script>

<template>
  <main class="flex flex-row w-full min-h-[100dvh]">
    <Transition name="slide-left">
    <section v-if="['default', 'xs', 'sm'].includes(themeStore.activeBreakpoint) ? !selectedRoomObject : true " class=" p-4 shrink-0 flex w-full md:min-w-[350px] md:w-[30vw] md:max-w-[500px] flex-col gap-4" >
        <div class=" flex gap-4 shrink-0 bg-white/40 dark:bg-white/5 px-2 py-4 rounded-xl backdrop-blur-[2px] shadow-sm z-40">
          <img src="https://picsum.photos/500" alt="user profile picture" class=" w-12 aspect-square object-cover rounded-full shrink-0">
          <div class=" grow text-sm flex flex-col justify-center">
            <p class=" font-bold text-base">{{ authStore.username }}</p>
          </div>
          <div class=" flex justify-center items-center gap-2">
            <button @click="themeStore.toggleTheme" class=" text-text dark:text-text-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300 p-2">
              <Sun v-if="themeStore.isDarkTheme" class=" w-6 h-6"></Sun>
              <Moon v-else class=" w-6 h-6"></Moon>
            </button>
            <button @click="logoutModal = true" class=" text-text hover:text-red-500 dark:hover:text-red-500 dark:text-text-dark rounded-lg hover:bg-red-100 dark:hover:bg-red-600/10 transition-all duration-300 p-2">
              <Logout class="w-6 h-6"/>
            </button>
          </div>
        </div>
  
        <div class=" bg-secondary/50 dark:bg-secondary-dark/20 grow rounded-2xl flex-col shadow-xl flex backdrop-blur-sm z-10" >
          <div class="my-4 px-4">
            <div class="flex mb-3 justify-between items-center">
              <h1 class=" text-2xl font-bold ">All Rooms</h1>
              <MoreOption @browseClick="browseModal = !browseModal"/>
            </div>
            <div class="relative w-full shrink-0">
              <input type="text" v-model="search" class=" p-2 bg-background focus:ring-1 ring-teal-500/50 dark:bg-secondary-dark/50 w-full rounded-xl text-base" placeholder="Search...">
              <Search v-if="!search" class=" w-4 h-4 absolute top-[50%] -translate-y-[50%] right-4" />
              <button v-else class=" hover:cursor-pointer absolute top-[50%] -translate-y-[50%] right-4" @click="search = ''" >
                <Close  class=" w-5 h-5 " />
              </button>
            </div>
          </div>
          <div ref="roomsParent" class=" grow h-1  overflow-y-auto" :class="themeStore.isDarkTheme ? 'dark' : ''">
            <p v-if="filteredRooms.length === 0 && roomStore.joinedRooms.length !== 0" class=" text-center font-semibold" key="not-found">No Rooms Found</p>
            <div v-if="roomStore.joinedRooms.length === 0" class=" h-full grid place-items-center">
              <div class=" mx-auto dark:bg-teal-100/5 bg-black/5 rounded-xl p-4 w-fit">
                <UsersChat class=" mx-auto w-20 h-20" />
                <p class=" font-semibold">You Haven't Join Any Room</p>
                <Primary @click="browseModal = true" class=" !mx-auto mt-2 !px-3 text-sm !block">Browse Room</Primary>         
              </div>            
            </div>
            <div @click="() => handleRoomChange(room)" v-for="(room, index) in filteredRooms" :key="room.id" :class="selectedRoomObject?.id === room.id ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'" class=" px-2 flex gap-4 shrink-0 transition-all duration-200 hover:cursor-pointer select-none items-center">
              <img src="https://picsum.photos/400/300" alt="user profile picture" class=" h-12 aspect-square object-cover rounded-full shrink-0">
              <div class=" grow text-sm min-h-[69px] flex flex-col justify-center min-w-0 border-b-[1px] border-accent/10 dark:border-accent-dark/10 py-3 ">
                <div class=" flex align-bottom">
                  <p class=" font-semibold grow text-base text-ellipsis inline-block w-full whitespace-nowrap overflow-hidden">{{ room.name }}</p>
                  <span v-if="room.messages.length > 0" class=" text-xs shrink-0">
                    {{ formatTimeString(room.messages.at(-1)?.createdAt) }}
                  </span>
                </div>
                <div v-if="room.messages.length > 0" class="flex gap-2">
                  <p class="grow text-ellipsis inline-block w-full whitespace-nowrap overflow-hidden ">
                    {{ room.messages.at(-1)?.message }}
                  </p>
                  <span v-if="Math.random() > 0.5" class=" shrink-0 text-xs grid place-content-center  w-3 h-3 ml-auto rounded-full bg-primary dark:bg-primary-dark"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Transition>

    <section class=" relative grow py-4 pr-4 pl-4 h-[100dvh] md:pl-0" :class="!selectedRoomObject && 'mobile-hide'">
      <Transition name="slide" mode="out-in">
        <div v-if="selectedRoomObject" class="w-full h-full flex flex-col gap-2">
          <div class=" w-full z-10 backdrop-blur-sm bg-secondary/50 dark:bg-secondary-dark/20 shrink-0 flex gap-2 p-4 rounded-2xl items-center">        
            <button @click="selectedRoomObject = ''" class=" p-2 hover:bg-secondary dark:hover:bg-secondary-dark rounded-full transition-colors duration-300">
              <ChevronLeft class=" w-6 aspect-square" />
            </button>
            <img src="https://picsum.photos/400/300" alt="user profile picture" class=" w-10 aspect-square object-cover rounded-full shrink-0">
            <p class=" font-bold h-fit grow text-batext-base">{{ selectedRoomObject.name }}</p>
            <ChatMoreOption @timeToggleClick="() => showTime = !showTime" @exitRoomClick="() => exitRoomModal = true" :showTime="showTime" />
          </div>
          <div class=" h-1 grow z-0">
            <ChatView :showTime="showTime" :messagesData="selectedRoomObject.messages" />
          </div>
          <form autocomplete="off" @submit.prevent="handleNewMessage()" class=" shrink-0 flex gap-3">
            <div class=" grow">
              <input v-model="newMessage" id="message_input" type="text" class=" p-2 bg-white focus:ring-1 ring-teal-500/50 dark:bg-secondary-dark/90 w-full rounded-xl text-base" placeholder="Message">
            </div>
            <Primary type="submit" class=" shrink-0 !rounded-full !p-2 w-10 h-10 flex justify-center items-center">
              <PaperPlane class=" w-5 h-5 text-white" />
            </Primary>
          </form>
        </div>
        <div v-else  class=" bg-red-500 h-full hidden md:block">
          background
        </div>
      </Transition>
    </section>
  </main>

  <ConfirmModal @confirmClick="authStore.logout" @toggle="(value) => logoutModal = value " :showModal="logoutModal" title="Logout" body="Are you sure?" confirmText="Logout" />
  <BrowseRoom @toggle="(value) => browseModal = value" :showModal="browseModal" />
  <ConfirmModal @confirmClick="() => {roomStore.exitRoom(selectedRoomObject.id); selectedRoomObject = null; exitRoomModal = false}"  @toggle="(value) => exitRoomModal = value" :showModal="exitRoomModal" title="Exit" body="Exit from this room?" confirmText="Exit" />
</template>

<style scoped>
.mobile-hide {
  @apply hidden md:block;
}

.mobile-sidebar-fill {
  @apply w-full flex md:min-w-[350px] md:w-[30vw] md:max-w-[500px];
}

.mobile-sidebar-hide {
  @apply hidden md:flex md:min-w-[350px] md:w-[30vw] md:max-w-[500px];
}

.slide-enter-active {
  transition: all 0.2s ease-in-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}


.slide-left-enter-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>