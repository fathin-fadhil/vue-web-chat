import { useAuthStore } from '@/stores/auth.store.js';

export default ({ to, from, next }) => {
  const auth = useAuthStore();
  if (auth.username) {
    return next({
      name: 'home',
    });
  }

  return next();
};
