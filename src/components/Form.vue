<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Название задачи -->
    <div class="pb-4">
      <label for="title" class="block font-medium text-white pb-2">
        Название задачи
      </label>
      <input
        v-model.trim="form.title"
        id="title"
        type="text"
        placeholder="Введите название задачи"
        class="w-full px-3 py-2 bg-white rounded-md text-gray-900 placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent"
      />
      <p v-if="errors.title" class="text-red-800   pt-1">{{ errors.title }}</p>
    </div>

    <!-- Стек -->
    <div class="pb-4">
      <label for="stack" class="block font-medium text-white pb-2">
        Технология / стек
      </label>
      <div class="relative">
        <select
          v-model="form.stack"
          id="stack"
          class="w-full px-3 py-2 bg-white rounded-md text-gray-900 appearance-none
                 focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent"
        >
          <option value="" disabled>Выберите технологию</option>
          <option v-for="option in stackOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <p v-if="errors.stack" class="text-red-800   pt-1">{{ errors.stack }}</p>
    </div>

    <!-- Описание -->
    <div class="pb-4">
      <label for="description" class="block font-medium text-white pb-2">
        Описание задачи
      </label>
      <textarea
        v-model.trim="form.description"
        id="description"
        rows="4"
        placeholder="Подробно опишите задачу..."
        class="w-full px-3 py-2 bg-white rounded-md text-gray-900 placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent resize-none"
      ></textarea>
      <p v-if="errors.description" class="text-red-800   pt-1">{{ errors.description }}</p>
    </div>

    <!-- Кнопка -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full bg-red-800 hover:bg-red-900 disabled:bg-red-900/70 disabled:cursor-not-allowed
             text-white font-semibold py-4 text-lg uppercase px-5 rounded-md transition duration-200
             focus:outline-none focus:ring-2 focus:ring-red-900"
    >
      {{ isSubmitting ? 'Создаём...' : 'Создать задачу' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  stackOptions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['task-created'])

const form = reactive({
  title: '',
  stack: '',
  description: ''
})

const errors = reactive({
  title: '',
  stack: '',
  description: ''
})

const isSubmitting = ref(false)

// Валидация
const validateForm = () => {
  let isValid = true

  // Сброс ошибок
  errors.title = ''
  errors.stack = ''
  errors.description = ''

  if (!form.title || form.title.length < 3) {
    errors.title = 'Название должно содержать минимум 3 символа'
    isValid = false
  }

  if (!form.stack) {
    errors.stack = 'Выберите технологию / стек'
    isValid = false
  }

  if (!form.description || form.description.length < 20) {
    errors.description = 'Описание должно содержать минимум 20 символов'
    isValid = false
  } else if (form.description.length > 800) {
    errors.description = 'Описание слишком длинное (максимум 800 символов)'
    isValid = false
  }

  return isValid
}

// Сброс формы
const resetForm = () => {
  form.title = ''
  form.stack = ''
  form.description = ''
}

// Обработчик отправки
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const newTask = {
      title: form.title.trim(),
      stack: form.stack,
      description: form.description.trim()
    }

    emit('task-created', newTask)

    resetForm()
  } catch (err) {
    console.error('Ошибка при создании задачи:', err)
    alert('Произошла ошибка при создании задачи')
  } finally {
    isSubmitting.value = false
  }
}
</script>
