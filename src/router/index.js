import { createRouter, createWebHistory } from 'vue-router';
import middlewarePipeline from '@/middleware/middlewarePipeline.js';

import main from './main';
import auth from './auth';

const arr_routes = [main, auth];

const routes = arr_routes.flat(1);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = ''

  if(to.meta.title){
    document.title = to.meta.title + ' · Vue 3';
  }

  if (!to.meta.middleware) {
    return next();
  }

  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    next,
  };

  if (middleware.length > 0) {
    return middleware[0]({
      ...context,
      next: middlewarePipeline(context, middleware, 1),
    });
  }
});

export default router;

