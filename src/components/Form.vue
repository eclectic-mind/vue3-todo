<!-- components/TaskForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Поле "Название" -->
    <div class="pb-4">
      <label for="title" class="block font-medium text-white pb-2">
        Название задачи
      </label>
      <input
        v-model="localForm.title"
        id="title"
        type="text"
        placeholder="Введите название задачи"
        class="w-full px-3 py-2 bg-white rounded-md text-gray-900 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent"
      />
    </div>

    <!-- Поле "Стек" (select) -->
    <div class="pb-4">
      <label for="stack" class="block font-medium text-white pb-2">
        Технология / стек
      </label>
      <select
        v-model="localForm.stack"
        id="stack"
        class="w-full px-3 py-2 bg-white rounded-md text-gray-900
        focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent"
      >
        <option value="" disabled>Выберите технологию</option>
        <option v-for="option in stackOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Поле "Описание" (textarea) -->
    <div class="pb-4">
      <label for="description" class="block font-medium text-white pb-2">
        Описание задачи
      </label>
      <textarea
        v-model="localForm.description"
        id="description"
        rows="4"
        placeholder="Подробно опишите задачу..."
        class="w-full px-3 py-2 bg-white rounded-md text-gray-900
        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent resize-none"
      ></textarea>
    </div>

    <!-- Кнопка отправки -->
    <button
      type="submit"
      class="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-4 text-lg uppercase
      px-5 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2
      focus:ring-red-900"
    >
      Создать задачу
    </button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

// Пропсы
const props = defineProps({
  initialForm: {
    type: Object,
    default: () => ({
      id: '',
      title: '',
      stack: '',
      description: ''
    })
  },
  stackOptions: {
    type: Array,
    default: () => [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'design', label: 'Design' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'seo', label: 'SEO' },
      { value: 'python', label: 'Python' },
      { value: 'css', label: 'CSS' }
    ]
  }
})

// События
const emit = defineEmits(['task-created', 'form-update'])

// Локальное состояние формы
const localForm = reactive({
  title: props.initialForm.title,
  stack: props.initialForm.stack,
  description: props.initialForm.description
})

// Watch для отслеживания изменений каждого поля
watch(() => localForm.title, (newValue, oldValue) => {
  console.log(`Название изменено: "${oldValue}" → "${newValue}"`)

  if (newValue && newValue.length < 3) {
    console.warn('Название слишком короткое (минимум 3 символа)')
  }
  emit('form-update', { field: 'title', value: newValue })
})

watch(() => localForm.stack, (newValue, oldValue) => {
  console.log(`Стек изменен: "${oldValue || 'не выбран'}" → "${newValue || 'не выбран'}"`)
  emit('form-update', { field: 'stack', value: newValue })
})

watch(() => localForm.description, (newValue, oldValue) => {
  const newLength = newValue?.length || 0
  const oldLength = oldValue?.length || 0
  console.log(`Описание изменено: ${oldLength} симв. → ${newLength} симв.`)

  if (newLength > 0 && newLength < 20) {
    console.warn('Описание слишком короткое (рекомендуется минимум 20 символов)')
  } else if (newLength > 500) {
    console.warn('Описание слишком длинное (максимум 500 символов)')
  }
  emit('form-update', { field: 'description', value: newValue })
})

// Отслеживание всей формы
watch(
  () => localForm,
  (newValue) => {
    console.log('Форма обновлена:', newValue)

    const isFormValid = newValue.title && newValue.stack && newValue.description
    if (isFormValid) {
      console.log('✅ Все поля заполнены, форма готова к отправке')
    } else {
      const missingFields = []
      if (!newValue.title) missingFields.push('название')
      if (!newValue.stack) missingFields.push('стек')
      if (!newValue.description) missingFields.push('описание')
      console.log(`❌ Не заполнены поля: ${missingFields.join(', ')}`)
    }
  },
  { deep: true }
)

// Debounce для поиска
let debounceTimeout
watch(() => localForm.title, (newValue) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    if (newValue) {
      console.log(`🔍 Поиск похожих задач: "${newValue}"`)
    }
  }, 500)
})

// Обработчик отправки
const handleSubmit = () => {
  // Валидация
  const errors = []

  if (!localForm.title || localForm.title.trim().length < 3) {
    errors.push('Название должно содержать минимум 3 символа')
  }

  if (!localForm.stack) {
    errors.push('Выберите технологию/стек')
  }

  if (!localForm.description || localForm.description.trim().length < 20) {
    errors.push('Описание должно содержать минимум 20 символов')
  }

  if (errors.length > 0) {
    console.error('Ошибки валидации:', errors)
    alert(`Пожалуйста, исправьте следующие ошибки:\n${errors.join('\n')}`)
    return
  }

  // Создаем задачу
  const newTask = {
    id: Date.now(),
    title: localForm.title.trim(),
    stack: localForm.stack,
    description: localForm.description.trim(),
    createdAt: new Date().toISOString()
  }

  console.log('📝 Создана новая задача:', newTask)

  // Отправляем событие родителю
  emit('task-created', newTask)

  // Очищаем форму
  resetForm()

  alert('Задача успешно создана!')
}

// Сброс формы
const resetForm = () => {
  localForm.title = ''
  localForm.stack = ''
  localForm.description = ''
  console.log('Форма сброшена')
}

// Доступ к методам из родителя
defineExpose({
  resetForm,
  getFormData: () => ({ ...localForm })
})
</script>
