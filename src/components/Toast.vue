<script setup>
  import { ref,} from 'vue'

  const show = ref(false)
  const message = ref('')
  const type = ref('success')

  const showNotification = (msg, notificationType = 'success') => {
    message.value = msg
    type.value = notificationType
    show.value = true

    setTimeout(() => {
      show.value = false
    }, 5000)
  }

  defineExpose({
    showNotification
  })
</script>

<template>
  <div
    v-if="show"
    class="fixed bottom-6 right-6 z-50"
  >
    <div
      :class="[
        'flex items-center gap-3 px-5 py-4 rounded-lg',
        type === 'success'
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      ]"
    >

      <div class="flex-shrink-0">
        <svg
          v-if="type === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M6 18L18 6M6 6h12v12"
          />
        </svg>
      </div>

      <div class="flex-1">
        {{ message }}
      </div>

      <button
        @click="show = false"
        class="flex-shrink-0 text-white/80 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
</template>
