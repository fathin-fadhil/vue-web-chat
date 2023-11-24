<script setup>
import Search from '../../components/icons/Search.vue';
import Close from '../../components/icons/Close.vue'
import UsersGroup from '../../components/icons/UsersGroup.vue'
import { ref } from "@vue/reactivity";
import { useRoomStore } from '../../stores/room.store';
import { onMounted, watch } from 'vue';
import { useAutoAnimate } from "@formkit/auto-animate/vue";
import PrimaryButton from '../../components/Button/Primary.vue'
import SecondaryButton from '../../components/Button/Secondary.vue'
import Spinner from '../icons/Spinner.vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});

const roomStore = useRoomStore()
const [ parent ] = useAutoAnimate()

const emits = defineEmits(["toggle"]);

function toggleShow(value) {
  emits("toggle", value);
}

const search = ref('')
const isLoading = ref(true)
const rooms = ref(roomStore.rooms)

onMounted(async () => {
  await roomStore.getRooms()
  rooms.value = roomStore.searchRoomByName(search.value)
  isLoading.value = false
})

watch([search, () => roomStore.rooms], () => {
  rooms.value = roomStore.searchRoomByName(search.value)
})

watch([() => props.showModal], () => {props.showModal && roomStore.getRooms()})

function handleJoin(roomId) {
  roomStore.joinRoom(roomId)
}
</script>

<template>
  <transition name="fade" appear>
    <div class="modal-overlay" v-if="showModal" @click="toggleShow(false)" ></div>
  </transition>
  <transition name="pop" appear>
    <div v-if="showModal" class="modal px-4 max-w-lg w-full h-[90dvh]">
      <div class="flex flex-col overflow-auto backdrop-blur-lg h-full bg-white/80 dark:bg-[rgb(6,14,8)]/90 rounded-2xl" role="dialog" >
        <section class=" grow px-8 pt-6 pb-1 flex flex-col justify-start gap-2">
          <h1 class=" font-bold text-2xl shrink-0 mb-2">Browse Rooms</h1>
          <div class="relative w-full shrink-0">
            <input type="text" v-model="search" class=" p-2 bg-white/60 dark:bg-[rgb(15,23,17)]/70 focus:ring-1 ring-teal-500/50 w-full rounded-xl text-base" placeholder="Search...">
            <Search v-if="!search" class=" w-4 h-4 absolute top-[50%] -translate-y-[50%] right-4" />
            <button v-else class=" hover:cursor-pointer absolute top-[50%] -translate-y-[50%] right-4" @click="search = ''" >
              <Close  class=" w-5 h-5 " />
            </button>
          </div>
          <div ref="parent" class=" flex flex-col grow h-0 overflow-y-auto overflow-x-hidden relative">
            <p v-if="rooms.length === 0 && !isLoading" class="  text-center font-semibold mt-2" key="not-found">No Rooms Found</p>
            <div role="status" v-if="isLoading && rooms.length === 0" class=" flex rounded-xl bg-black/5 dark:bg-gray-50/5 p-4 flex-col absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] gap-2 justify-center items-center">
                <Spinner class=" w-8 h-8" />
                <span class="font-semibold">Loading Data</span>
            </div>
            <div class=" flex gap-4 py-4 dark:hover:bg-black/20 hover:bg-white/30 transition-colors px-4 border-slate-500/50 " :class="index !== rooms.length -1 ? 'border-b-[1px]' : ''" v-for="(room, index) in rooms" :key="room.id">
              <span class=" flex justify-center items-center">
                <UsersGroup class="w-6 h-6" />
              </span>
              <div class=" flex flex-col justify-center grow">
                <h2 class=" font-bold">{{ room.name }}</h2>
                <p class=" text-xs md:text-sm">Created At: {{ (new Date(room.createdAt)).toDateString() }}</p>
              </div>
              <div class=" flex justify-center items-center">
                <PrimaryButton v-if="!roomStore.checkAlreadyInRoom(room.id)" @click="roomStore.joinRoom(room.id)" class=" text-sm !px-4 !py-1">Join</PrimaryButton>
                <SecondaryButton v-else @click="roomStore.exitRoom(room.id)" class="text-sm !px-4 !py-1">Exit</SecondaryButton>
              </div>
            </div>
          </div>
        </section>
        <section class=" shrink-0 flex border-t-[1px] border-accent/40 text-sm">
          <button @click="toggleShow(false)" class=" text-blue-500 transition-colors duration-300 hover:bg-black/20 grow font-semibold p-4 border-accent/40">Cancel</button>
        </section>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.button {
  border: none;
  color: #fff;
  background: #42b983;
  appearance: none;
  font: inherit;
  font-size: 1.8rem;
  padding: 0.5em 1em;
  border-radius: 0.3em;
  cursor: pointer;
}

.modal {
  position: absolute;
  position: fixed;
  inset: 0;
  margin: auto;
  z-index: 999;
  transform: none;
}
.modal-overlay {
  content: "";
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.18);
  z-index: 998;
  /* backdrop-filter: blur(5px); */
  cursor: pointer;
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>

