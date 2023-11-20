import './assets/main.css'
import 'remixicon/fonts/remixicon.css';
import 'vue3-toastify/dist/index.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import moment from 'moment';
import VueSweetalert2 from 'vue-sweetalert2';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueSweetalert2, {
  confirmButtonColor: '#5fa5f9',
  cancelButtonColor: '#ACACAC',
});
app.use(createPinia())
app.use(router)

app.config.globalProperties.$dateFormat = (value, format) => {
    return moment(value).format(format);
}

app.mount('#app')
