<script setup>
import Bell from '../../components/icons/Bell.vue';
import { useThemeStore } from "../../stores/theme.store";
import Sun from '../../components/icons/Sun.vue';
import Moon from '../../components/icons/Moon.vue';
import Search from '../../components/icons/Search.vue';

const themeStore = useThemeStore()

const arr = [1,2,3,4,4,4,4,4,4,4,4,]

</script>

<template>
  <main class="flex flex-row w-full min-h-screen">
    <section class=" p-2 lg:p-4  min-w-[300px] w-[30vw] max-w-[500px] shrink-0 flex flex-col gap-2">
      <div class=" flex gap-4 shrink-0">
        <img src="https://picsum.photos/500" alt="user profile picture" class=" w-12 aspect-square object-cover rounded-full shrink-0">
        <div class=" grow text-sm flex flex-col justify-center">
          <p class=" font-bold">This User</p>
          <p class=" ">@username</p>
        </div>
        <div class=" flex justify-center items-center gap-2">
          <button @click="themeStore.toggleTheme" class=" text-text dark:text-text-dark rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-all duration-300 p-2">
            <Sun v-if="themeStore.isDarkTheme" class=" w-5 h-5"></Sun>
            <Moon v-else class=" w-5 h-5"></Moon>
          </button>
          <Bell class=" w-5 h-5 text-text dark:text-text-dark" />
        </div>
      </div>

      <div class=" bg-secondary/50 dark:bg-secondary-dark/20 grow rounded-2xl flex flex-col shadow-xl">
        <div class="relative w-full shrink-0 p-2">
          <input type="text" class=" p-2 bg-background dark:bg-secondary-dark/50 w-full rounded-2xl text-sm" placeholder="Search...">
          <Search class=" w-4 h-4 absolute top-[50%] -translate-y-[50%] right-4" />
        </div>
        <div class=" grow h-1 overflow-y-auto" :class="themeStore.isDarkTheme ? 'dark' : ''">
            <div v-for="(item, index) in arr" :key="index" class=" flex gap-4 shrink-0 hover:bg-black/5 p-2 dark:hover:bg-white/5 transition-all duration-200">
              <img src="https://picsum.photos/400/300" alt="user profile picture" class=" w-10 aspect-square object-cover rounded-full shrink-0">
              <div class=" grow text-sm flex flex-col justify-center min-w-0 ">
                <p class=" font-bold">Another User</p>
                <p class="text-ellipsis inline-block w-full whitespace-nowrap overflow-hidden ">awfwafwafwa wa awafwa oiwaoinofoaw</p>
              </div>
              <div class=" flex flex-col justify-end items-center gap-2">            
                <span class=" text-xs">10/23/2077</span>
                <span class=" w-5 text-xs grid place-content-center aspect-square ml-auto text-white rounded-full bg-red-500">1</span>
              </div>
            </div>
        </div>
      </div>
    </section>
    <section class=" grow">
      aaa
    </section>
  </main>
</template>