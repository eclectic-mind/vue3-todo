<script setup>
import { ref } from 'vue'

import Card from './components/Card.vue'
import FilterButton from './components/FilterButton.vue'
import Form from './components/Form.vue'

const activeFilter = ref('all')
const taskFormRef = ref(null)
const tasks = ref([])

// Уже имеющиеся задачи
const oldTasks = [
  {
    id: 1,
    title: 'React Компоненты высшего порядка',
    stack: 'react',
    description: 'React Hooks позволяют использовать состояние и другие возможности React без написания классов. Они упрощают логику компонентов, делая код более читаемым и переиспользуемым. useState, useEffect, useContext — это базовые хуки, которые используются в каждом проекте. Кастомные хуки помогают выносить повторяющуюся логику в отдельные функции.'
  },
  {
    id: 2,
    title: 'TypeScript типизация данных',
    stack: 'typescript',
    description: 'TypeScript добавляет статическую типизацию в JavaScript, что помогает находить ошибки на этапе разработки. Интерфейсы, типы, дженерики позволяют создавать самодокументируемый код.'
  },
  {
    id: 3,
    title: 'Tailwind CSS утилиты',
    stack: 'css',
    description: 'Tailwind CSS — это utility-first фреймворк, который предоставляет низкоуровневые классы для построения интерфейсов прямо в разметке. Вместо написания кастомного CSS вы комбинируете готовые утилиты: flex, padding, margin, цвета, отзывчивость.'
  },
  {
    id: 4,
    title: 'Next.js серверный рендеринг',
    stack: 'react',
    description: 'Next.js — это React фреймворк для production с серверным рендерингом, статической генерацией и маршрутизацией на основе файловой системы. Он автоматически оптимизирует производительность, поддерживает API Routes и позволяет легко настраивать мета-теги для SEO. Подходит для создания быстрых веб-приложений.'
  },
  {
    id: 5,
    title: 'Современный UI/UX дизайн интерфейсов',
    stack: 'design',
    description: 'Современный UI/UX дизайн включает в себя не только визуальную составляющую, но и глубокое понимание поведения пользователей. Использование дизайн-систем, компонентных подходов и прототипирования ускоряет разработку в разы. Адаптивный дизайн, микро-анимации и доступность интерфейсов — ключевые тренды последних лет. Инструменты вроде Figma и Sketch позволяют создавать интерактивные прототипы любой сложности.'
  },
  {
    id: 6,
    title: 'Оптимизация сайта для поисковых систем',
    stack: 'seo',
    description: 'SEO-оптимизация включает в себя комплекс мер для повышения позиций сайта в результатах выдачи поисковых систем. Ключевые аспекты: семантическое ядро, правильная структура URL, мета-теги и микроразметка Schema.org. Скорость загрузки страниц и мобильная адаптация напрямую влияют на ранжирование в Google. Качественный контент и внешние ссылки остаются основными факторами доверия поисковых систем к ресурсу.'
  }
]

// Стеки
const stackOptions = [
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

// Обработчик создания задачи
const handleTaskCreated = (newTask) => {
  tasks.value.push(newTask)
  console.log('Задача добавлена в список:', newTask)
}

// Обработчик обновления формы
const handleFormUpdate = ({ field, value }) => {
  console.log(`Поле ${field} обновлено:`, value)
}

// Обработчик удаления задачи
const handleTaskDelete = (taskId) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId);
  oldTasks.value = oldTasks.value.filter(task => task.id !== taskId);
  console.log('Задача удалена:', taskId)
}

// Обработчик клика на фильтр
const handleFilterClick = (filterValue) => {
  activeFilter.value = filterValue
  console.log('Выбран фильтр:', filterValue)
}
</script>

<template>
  <div class="w-screen bg-orange-100 h-screen flex flex-col md:overflow-hidden">
    <header class="bg-orange-300 sticky top-0 z-50">
      <div class="w-full mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <h1 class="text-4xl text-black font-bold">ToDo List</h1>
        </div>
      </div>
    </header>

    <main class="flex-1 flex min-h-0 text-base">
      <div class="w-full flex">
        <div class="grid grid-cols-1 md:grid-cols-3">

          <!-- Левая колонка -->
          <section class="md:col-span-1 flex flex-col bg-orange-500 px-6 py-8 text-white">
            <h2 class="text-2xl font-semibold">Добавить задачу</h2>

            <!-- Форма -->
            <div class="flex-1 pt-6">
              <Form
                ref="taskFormRef"
                :stack-options="stackOptions"
                @task-created="handleTaskCreated"
                @form-update="handleFormUpdate"
              />
            </div>

            <pre class="text-xs mt-4">{{ JSON.stringify(tasks, null, 2) }}</pre>
          </section>

          <!-- Правая колонка -->
          <section class="md:col-span-2 flex flex-col bg-orange-200 px-6 py-8  md:overflow-hidden">
            <h2 class="text-2xl font-semibold text-black">Созданные задачи</h2>

            <!-- Фильтры -->
            <div class="w-full pt-6 pb-6">
              <p class="text-orange-600 font-normal">Фильтровать по стеку:</p>
              <div class="flex flex-wrap gap-2 min-w-max pt-2">
                <FilterButton
                  v-for="filter in stackOptions"
                  :key="filter.value"
                  :label="filter.label"
                  :filter-value="filter.value"
                  :active-filter="activeFilter"
                  @click="handleFilterClick"
                />
              </div>
            </div>

            <!-- Карточки -->
            <div class="flex-1 md:pr-2 md:overflow-y-auto">
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <Card
                    v-for="task in oldTasks"
                    :key="task.id"
                    :id="task.id"
                    :title="task.title"
                    :stack="task.stack"
                    :description="task.description"
                    @delete="handleTaskDelete"
                  />
                </div>
            </div>

          </section>

        </div>
      </div>
    </main>
  </div>
</template>
