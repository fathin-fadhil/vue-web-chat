import LoginView from '@/views/auth/login/index.vue'
import RegisterView from '@/views/auth/register/index.vue'

import MainLayout from '../layouts/MainLayout.vue'

// middleware
import GuestMiddleware from '@/middleware/guest.middleware.js';

export default [{
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login',
      layout: MainLayout,
      middleware: [GuestMiddleware],
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Register',
      middleware: [GuestMiddleware],
    },
  }
]
