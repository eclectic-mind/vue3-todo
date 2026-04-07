<script setup>
import { reactive, watch, ref } from 'vue'

const activeFilter = ref('all')

// Состояние формы
const form = reactive({
  title: '',
  stack: '',
  description: ''
})

// Варианты для select
const stackOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tailwind', label: 'Tailwind' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'django', label: 'Django' }
]

// Watch для отслеживания изменений каждого поля

// 1. Отслеживание конкретного поля
watch(() => form.title, (newValue, oldValue) => {
  console.log(`Название изменено: "${oldValue}" → "${newValue}"`)

  // Дополнительная логика: валидация в реальном времени
  if (newValue && newValue.length < 3) {
    console.warn('Название слишком короткое (минимум 3 символа)')
  }
})

// 2. Отслеживание стека
watch(() => form.stack, (newValue, oldValue) => {
  console.log(`Стек изменен: "${oldValue || 'не выбран'}" → "${newValue || 'не выбран'}"`)
})

// 3. Отслеживание описания
watch(() => form.description, (newValue, oldValue) => {
  const newLength = newValue?.length || 0
  const oldLength = oldValue?.length || 0
  console.log(`Описание изменено: ${oldLength} симв. → ${newLength} симв.`)

  // Валидация длины описания
  if (newLength > 0 && newLength < 20) {
    console.warn('Описание слишком короткое (рекомендуется минимум 20 символов)')
  } else if (newLength > 500) {
    console.warn('Описание слишком длинное (максимум 500 символов)')
  }
})

// 4. Отслеживание всей формы целиком (глубокое)
watch(
  () => form,
  (newValue) => {
    console.log('Форма обновлена:', newValue)

    // Проверка, заполнены ли все поля
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

// Простой debounce для поиска/валидации
let debounceTimeout
watch(() => form.title, (newValue) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    if (newValue) {
      // Имитация API запроса или сложной валидации
      console.log(`🔍 Поиск похожих задач: "${newValue}"`)
    }
  }, 500)
})

// Обработчик отправки формы
const handleSubmit = () => {
  // Валидация перед отправкой
  const errors = []

  if (!form.title || form.title.trim().length < 3) {
    errors.push('Название должно содержать минимум 3 символа')
  }

  if (!form.stack) {
    errors.push('Выберите технологию/стек')
  }

  if (!form.description || form.description.trim().length < 20) {
    errors.push('Описание должно содержать минимум 20 символов')
  }

  // Если есть ошибки - показываем и прерываем отправку
  if (errors.length > 0) {
    console.error('Ошибки валидации:', errors)
    alert(`Пожалуйста, исправьте следующие ошибки:\n${errors.join('\n')}`)
    return
  }

  // Создаем объект задачи
  const newTask = {
    id: Date.now(),
    title: form.title.trim(),
    stack: form.stack,
    description: form.description.trim(),
    createdAt: new Date().toISOString()
  }

  console.log('📝 Создана новая задача:', newTask)

  // Здесь будет логика добавления задачи в список
  // Например, emit событие родителю или добавление в store
  // emit('task-created', newTask)

  // Очищаем форму после успешной отправки
  form.title = ''
  form.stack = ''
  form.description = ''

  // Или показываем сообщение об успехе
  alert('Задача успешно создана!')
}

// Можно добавить сброс формы
const resetForm = () => {
  form.title = ''
  form.stack = ''
  form.description = ''
  console.log('Форма сброшена')
}

// Экспортируем метод сброса, если нужно использовать извне
// defineExpose({ resetForm })
</script>

<template>
  <div class="w-screen bg-orange-100 h-screen flex flex-col md:overflow-hidden">

    <!-- HEADER -->
    <header class="bg-orange-300 sticky top-0 z-50">
      <div class="w-full mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <h1 class="text-4xl text-black font-bold">ToDo List</h1>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT - вот здесь главное изменение -->
    <main class="flex-1 flex min-h-0 text-base">
      <div class="w-full flex">

        <!-- Две колонки -->
        <div class="grid grid-cols-1 md:grid-cols-3">

          <!-- Левая колонка -->
          <section class="md:col-span-1 flex flex-col bg-orange-500 px-6 py-8 text-white">
            <h2 class="text-2xl font-semibold">Добавить задачу</h2>

            <!-- Форма должна тоже растягиваться, если нужно -->
            <div class="flex-1 pt-6">

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Поле "Название" -->
                <div class="pb-4">
                  <label for="title" class="block font-medium text-white pb-2">
                    Название задачи
                  </label>
                  <input
                    v-model="form.title"
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

                  <select v-model="form.stack"
                          id="stack"
                          class="w-full px-3 py-2 bg-white rounded-md text-gray-900
                          focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent">
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
                    v-model="form.description"
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
                  class="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-2
                  px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2
                  focus:ring-red-900"
                >
                  Создать задачу
                </button>
              </form>

            </div>

            <pre class="text-xs">{{ JSON.stringify(form, null, 2) }}</pre>
          </section>

          <!-- Правая колонка -->
          <section class="md:col-span-2 flex flex-col bg-orange-200 px-6 py-8">
            <h2 class="text-2xl font-semibold text-black">Созданные задачи</h2>

            <!-- Фильтры -->
            <div class="w-full pt-6">
              <p class="text-orange-600 mb-3">Фильтровать по стеку:</p>

              <div class="flex gap-2 pt-4">
                <button
                  v-for="filter in stackOptions"
                  :key="filter.value"
                  @click="activeFilter = filter.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    activeFilter === filter.value
                      ? 'bg-orange-400 text-white'
                      : 'bg-white/30 backdrop-blur-sm text-orange-600 hover:bg-white/60 border border-orange-600'
                  ]"
                          >
                  {{ filter.label }}
                </button>
              </div>
            </div>

            <div class="flex-1 pt-6 md:overflow-y-auto">

                <!-- Сетка карточек -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <!-- Карточка 1 -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                      <h3 class="text-xl font-semibold text-gray-800">React Компоненты высшего порядка</h3>
                      <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        React
                      </div>
                    </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      React Hooks позволяют использовать состояние и другие возможности React без написания классов.
                      Они упрощают логику компонентов, делая код более читаемым и переиспользуемым.
                      useState, useEffect, useContext — это базовые хуки, которые используются в каждом проекте.
                      Кастомные хуки помогают выносить повторяющуюся логику в отдельные функции.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition
                    duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                  <!-- Карточка 2 -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                      <h3 class="text-xl font-semibold text-gray-800">TypeScript типизация данных</h3>
                      <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        TS
                      </div>
                    </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      TypeScript добавляет статическую типизацию в JavaScript, что помогает находить ошибки на этапе разработки.
                      Интерфейсы, типы, дженерики позволяют создавать самодокументируемый код.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                  <!-- Карточка 3 -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                        <h3 class="text-xl font-semibold text-gray-800">Tailwind CSS утилиты</h3>
                        <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          CSS
                        </div>
                      </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      Tailwind CSS — это utility-first фреймворк, который предоставляет низкоуровневые классы для построения
                      интерфейсов прямо в разметке. Вместо написания кастомного CSS вы комбинируете готовые утилиты:
                      flex, padding, margin, цвета, отзывчивость.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                  <!-- Карточка 4 -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                        <h3 class="text-xl font-semibold text-gray-800">Next.js серверный рендеринг</h3>
                        <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Next
                        </div>
                    </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      Next.js — это React фреймворк для production с серверным рендерингом, статической генерацией и маршрутизацией
                      на основе файловой системы. Он автоматически оптимизирует производительность, поддерживает API Routes
                      и позволяет легко настраивать мета-теги для SEO. Подходит для создания быстрых веб-приложений.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                  <!-- Карточка с тегом Design -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                      <h3 class="text-xl font-semibold text-gray-800">Современный UI/UX дизайн интерфейсов</h3>
                      <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        Design
                      </div>
                    </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      Современный UI/UX дизайн включает в себя не только визуальную составляющую, но и глубокое понимание поведения пользователей.
                      Использование дизайн-систем, компонентных подходов и прототипирования ускоряет разработку в разы.
                      Адаптивный дизайн, микро-анимации и доступность интерфейсов — ключевые тренды последних лет.
                      Инструменты вроде Figma и Sketch позволяют создавать интерактивные прототипы любой сложности.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                  <!-- Карточка с тегом SEO -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                      <h3 class="text-xl font-semibold text-gray-800">Оптимизация сайта для поисковых систем</h3>
                      <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        SEO
                      </div>
                    </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      SEO-оптимизация включает в себя комплекс мер для повышения позиций сайта в результатах выдачи поисковых систем.
                      Ключевые аспекты: семантическое ядро, правильная структура URL, мета-теги и микроразметка Schema.org.
                      Скорость загрузки страниц и мобильная адаптация напрямую влияют на ранжирование в Google.
                      Качественный контент и внешние ссылки остаются основными факторами доверия поисковых систем к ресурсу.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                  <!-- Карточка с тегами Vue и Nuxt (два бейджа) -->
                  <div class="bg-white rounded-lg p-6 flex flex-col h-full">
                    <div class="flex gap-2 justify-between items-start mb-3">
                      <h3 class="text-xl font-semibold text-gray-800">Разработка SSR приложений на Vue и Nuxt</h3>
                      <div class="flex gap-2">
                        <div class="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Vue
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-600 pt-4 pb-4 flex-grow">
                      Vue.js — прогрессивный JavaScript фреймворк для создания пользовательских интерфейсов с реактивной системой.
                      Nuxt.js построен на основе Vue и добавляет серверный рендеринг, статическую генерацию и модульную архитектуру.
                      Автоматическая маршрутизация, middleware и store-менеджмент упрощают разработку сложных приложений.
                      Гибридный рендеринг позволяет комбинировать SSR, SSG и CSR в рамках одного проекта для оптимальной производительности.
                    </p>
                    <button type="button" class="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-700">
                      Удалить
                    </button>
                  </div>

                </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  </div>

</template>

<style scoped>

</style>
