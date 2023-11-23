import { defineStore } from 'pinia';
import router from '@/router/index.js';
import { ref } from "@vue/reactivity";

export const useAuthStore = defineStore('auth', () => {
    const username = ref(localStorage.getItem('username'))

    function login(usernameInfo) {
        username.value = usernameInfo;
        localStorage.setItem('username', usernameInfo);
        router.push({ name: 'home'})
    }

    function logout() {
        username.value = null;
        localStorage.removeItem('username');
        router.push({ name: 'login'})
    }

    return { username, login, logout}
}) 