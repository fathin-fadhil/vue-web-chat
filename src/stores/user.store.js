import { defineStore } from 'pinia';
import { axiosWrapper } from '@/helper/axios-wrapper.js';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        users: [],
        user: null,
    }),
    actions: {
        async fetch() {
            let url = `${baseUrl}/user`

            const users = await axiosWrapper.get(url);

            if (users) {
                this.users = users.data
            }
        },
        async add(data) {
          const user = await axiosWrapper.post(`${baseUrl}/user`, data, true);

          this.user = user.data

          return user
        },
        async update(id, data) {
          return await axiosWrapper.put(`${baseUrl}/user/${id}`, data, true);
        },
        async delete(id) {
          return await axiosWrapper.delete(`${baseUrl}/user/${id}`, {}, true);
        },
    },
});
