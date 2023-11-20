import { defineStore } from 'pinia';

export const useSegmentStore = defineStore({
  id: 'segment',
  state: () => ({
    segment: null,
  }),
  actions: {
    setSegment(segment) {
      this.segment = segment;
    },
  },
});
