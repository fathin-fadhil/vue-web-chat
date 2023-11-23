import { useAuthStore } from '@/stores/auth.store.js';
import { useSegmentStore } from '@/stores/segment.store.js';

export default ({ to, from, next }) => {
  const authStore = useAuthStore();
  const segment = useSegmentStore();

  if(to.meta.group){
    segment.setSegment(to.meta.group)
  }else{
    segment.setSegment(to.fullPath)
  }

  if (!authStore.username) {
    authStore.returnUrl = to.fullPath;

    return next({
      name: 'login',
    });
  }

  return next();
};
