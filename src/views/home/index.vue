<script setup>
import { useThemeStore } from "../../stores/theme.store";
import { useRoomStore } from "../../stores/room.store";
import { ref } from "@vue/reactivity";
import Sun from '../../components/icons/Sun.vue';
import Moon from '../../components/icons/Moon.vue';
import Search from '../../components/icons/Search.vue';
import Logout from '../../components/icons/Logout.vue'
import ChevronLeft from '../../components/icons/ChevronLeft.vue';
import Close from '../../components/icons/Close.vue'
import { onMounted, watch, watchEffect } from 'vue';
import MoreOption from '../../components/Menu/RoomMoreOption.vue'
import { useAuthStore } from "../../stores/auth.store";
import ConfirmSignout from "../../components/Modal/ConfirmSignout.vue";
import BrowseRoom from "../../components/Modal/BrowseRoom.vue";
import { useAutoAnimate } from "@formkit/auto-animate/vue";

const themeStore = useThemeStore()
const authStore = useAuthStore()
const roomStore = useRoomStore()
const [ parent ] = useAutoAnimate()

const selectedChatUserId = ref(-1)
const search = ref('')
const filteredRooms = ref(roomStore.searchJoinedRoomByName(search.value))
const logoutModal = ref(false)
const browseModal = ref(true)

function handleRoomChange(item) {
  if (selectedChatUserId.value === -1) {
    selectedChatUserId.value = item.userId; 
    window.history.pushState({}, null, null)
  } else {
    selectedChatUserId.value = item.userId; 
  }
}

onMounted(() => {
  addEventListener('popstate', () => {
    if (selectedChatUserId.value !== -1) {
      selectedChatUserId.value = -1
    }
  })
})

watch([search, () => roomStore.joinedRooms], () => {
  console.log('ran')
  filteredRooms.value = roomStore.searchJoinedRoomByName(search.value)
})
</script>

<template>
  <main class="flex flex-row w-full min-h-[100dvh]">
    <Transition name="slide-left">
      <section v-if="!['default', 'xs', 'sm'].includes(themeStore.activeBreakpoint) || selectedChatUserId === -1" class=" p-4 shrink-0 flex w-full md:min-w-[350px] md:w-[30vw] md:max-w-[500px] flex-col gap-4" >
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
          <div ref="parent" class=" grow h-1  overflow-y-auto" :class="themeStore.isDarkTheme ? 'dark' : ''">
            <p v-if="filteredRooms.length === 0" class=" text-center font-semibold" key="not-found">No Rooms Found</p>
            <div @click="() => handleRoomChange(room.id)" v-for="(room, index) in filteredRooms" :key="room.id" :class="selectedChatUserId === room.id ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'" class=" px-2 flex gap-4 shrink-0 transition-all duration-200 hover:cursor-pointer select-none items-center">
              <img src="https://picsum.photos/400/300" alt="user profile picture" class=" h-12 aspect-square object-cover rounded-full shrink-0">
              <div class=" grow text-sm flex flex-col justify-center min-w-0 border-b-[1px] border-accent/10 dark:border-accent-dark/10 py-3 ">
                <div class=" flex align-bottom">
                  <p class=" font-semibold grow text-base text-ellipsis inline-block w-full whitespace-nowrap overflow-hidden">{{ room.name }}</p>
                  <span class=" text-[10px] shrink-0">10/23/2077</span>
                </div>
                <div class="flex gap-2">
                  <p class="grow text-ellipsis inline-block w-full whitespace-nowrap overflow-hidden ">awfwafwafwa wa awafwa oiwaoinofoaw</p>
                  <span class=" shrink-0 w-5 text-xs grid place-content-center aspect-square ml-auto text-white rounded-full bg-red-500">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Transition>

    <section class=" relative grow py-4 pr-4 pl-4 md:pl-0" :class="selectedChatUserId === -1 && 'mobile-hide'">
      <Transition name="slide" mode="out-in">
        <div v-if="selectedChatUserId !== -1" class="w-full h-full">
          <div class=" w-full backdrop-blur-sm bg-secondary/50 dark:bg-secondary-dark/20 flex gap-2 p-4 rounded-2xl items-center">        
            <button @click="selectedChatUserId = -1" class=" p-2 hover:bg-secondary dark:hover:bg-secondary-dark rounded-full transition-colors duration-300">
              <ChevronLeft class=" w-6 aspect-square" />
            </button>
            <img src="https://picsum.photos/400/300" alt="user profile picture" class=" w-10 aspect-square object-cover rounded-full shrink-0">
            <p class=" font-bold h-fit grow text-batext-base">Another User</p>
          </div>
          {{ selectedChatUserId === -1 ? 'no chat' : selectedChatUserId }}
        </div>
        <div v-else  class=" bg-red-500 h-full hidden md:block">
          background
        </div>
      </Transition>
    </section>
  </main>

  <ConfirmSignout @toggle="(value) => logoutModal = value " :showModal="logoutModal" />
  <BrowseRoom @toggle="(value) => browseModal = value" :showModal="browseModal" />
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