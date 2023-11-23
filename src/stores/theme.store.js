import { defineStore } from "pinia";
import { ref } from "@vue/reactivity";
import { getActiveBrekpoint } from '../helper/tailwindBreakpoint';
import { onMounted, onUnmounted } from "vue";

function isDarkThemeInit() {
  if (localStorage.getItem('color-theme')) {
    return localStorage.getItem('color-theme') === 'light' ? false : true;
  } else {
    return document.documentElement.classList.contains('dark') ? true : false;
  }
}

export const useThemeStore = defineStore("theme", () => {
  const isDarkTheme = ref(isDarkThemeInit());
  const activeBreakpoint = ref(getActiveBrekpoint())

  function toggleTheme() {
    if (isDarkTheme.value) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light')
      isDarkTheme.value = false;
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      isDarkTheme.value = true;
    }
  }

  onMounted(() => {
    addEventListener('resize', updateBreakpoint)    
  })

  onUnmounted(() => {
    removeEventListener('resize', updateBreakpoint)
  })

  function updateBreakpoint() {
    activeBreakpoint.value = getActiveBrekpoint()
  }

  return { isDarkTheme, activeBreakpoint, toggleTheme };
})