<template>
  <button class="px-8 py-2 bg-secondary dark:bg-secondary-dark text-text dark:text-text-dark hover:brightness-75 transition-all duration-300 rounded-lg font-semibold" :type="props.type">
    <slot/>
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
