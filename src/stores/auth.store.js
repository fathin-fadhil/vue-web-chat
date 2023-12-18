import { defineStore } from 'pinia';
import router from '@/router/index.js';
import { ref } from "@vue/reactivity";
import { useRoomStore } from './room.store';


export const useAuthStore = defineStore('auth', () => {
    const roomStore = useRoomStore()
    const username = ref(localStorage.getItem('username') || '')

    function login(usernameInfo) {
        username.value = usernameInfo;
        localStorage.setItem('username', usernameInfo);
        router.push({ name: 'home'})
    }

    function logout() {
        roomStore.resetState()
        localStorage.clear();
        username.value = null;
        router.push({ name: 'login'})
    }

    return { username, login, logout}
}) 