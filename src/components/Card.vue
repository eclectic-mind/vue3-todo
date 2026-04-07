<script setup>
  defineProps({
    id: Number,
    title: String,
    stack: String,
    description: String
  })

  defineEmits(['delete'])
</script>

<template>
  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
    <div class="flex gap-2 justify-between items-start mb-3">
      <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
      <div class="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 uppercase">
        {{stack }}
      </div>
    </div>
    <p class="text-gray-600 pt-4 pb-4 flex-grow">
      {{ description }}
    </p>
    <button type="button"
            @click="$emit('delete', id)"
            class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition
                    duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600
                    focus:ring-offset-2 focus:ring-offset-red-700"
    >
      Удалить
    </button>
  </div>
</template>
