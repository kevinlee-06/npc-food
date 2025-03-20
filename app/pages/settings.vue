<script setup lang="ts">
const autoScroll = useCookie('auto-scroll', {
  default: () => true,
  watch: true,
})
</script>

<template>
  <h1>settings</h1>
  {{ autoScroll }}
  <div>
    <input
      id="auto-scroll"
      v-model="autoScroll"
      type="checkbox"
    >
  </div>
</template>
