<script setup>
  defineProps({
    label: String,
    filterValue: String,
    activeFilter: String
  })

  defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    @click="$emit('click', filterValue)"
    :class="[
      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 uppercase',
      activeFilter === filterValue
        ? 'bg-orange-400 text-white'
        : 'bg-white/30 backdrop-blur-sm text-orange-600 hover:bg-white/60 border border-orange-600'
    ]"
  >
    {{ label }}
  </button>
</template>

