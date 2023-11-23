import { defineStore } from 'pinia';
import router from '@/router/index.js';
import { ref } from "@vue/reactivity";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useAuthStore = defineStore('auth', () => {
    const username = ref(localStorage.getItem('username'))

    function login(usernameInfo) {
        username.value = usernameInfo;
        localStorage.setItem('username', usernameInfo);
        router.push({ name: 'home'})
    }

    function logut() {
        username.value = null;
        localStorage.removeItem('username');
        router.push({ name: 'login'})
    }

    return { username, login, logut }
}) 