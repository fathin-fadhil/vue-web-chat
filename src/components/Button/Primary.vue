<template>
  <button class="px-8 py-2 bg-primary hover:brightness-75 transition-all duration-300 dark:bg-primary-dark text-white dark:text-black rounded-lg font-semibold" :type="props.type">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  'type': {
    type: String,
    default: 'button'
  }
})

</script>
