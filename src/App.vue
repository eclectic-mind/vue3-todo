<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTasksStore } from './stores/tasks'

import Card from './components/Card.vue'
import FilterButton from './components/FilterButton.vue'
import Form from './components/Form.vue'
import Toast from './components/Toast.vue'

const store = useTasksStore()

const activeFilter = ref('all')
const notificationRef = ref(null)

// Загрузка задач
onMounted(() => {
  store.loadTasks()
})

// Фильтрация
const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') {
    return store.tasks
  }
  return store.tasks.filter(task => task.stack === activeFilter.value)
})

// Обработчики
const handleTaskCreated = (newTask) => {
  store.addTask(newTask)
  notificationRef.value?.showNotification('Задача успешно добавлена!', 'success')
}

const handleTaskDelete = (taskId) => {
  store.deleteTask(taskId)
  notificationRef.value?.showNotification('Задача удалена', 'success')
}

const handleFilterClick = (filterValue) => {
  activeFilter.value = filterValue
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
        <div class="w-full grid grid-cols-1 md:grid-cols-3">

          <!-- Форма -->
          <section class="md:col-span-1 flex flex-col bg-orange-500 px-6 py-8 text-white">
            <h2 class="text-2xl font-semibold">Добавить задачу</h2>

            <div class="flex-1 pt-6">
              <Form
                :stack-options="store.stackOptions"
                @task-created="handleTaskCreated"
              />
            </div>
          </section>

          <section class="w-full md:col-span-2 flex flex-col bg-orange-200 px-6 py-8 md:overflow-hidden">
            <h2 class="text-2xl font-semibold text-black">Созданные задачи</h2>

            <!-- Фильтры -->
            <div class="w-full pt-6 pb-6">
              <p class="text-orange-600 font-normal">Фильтровать по стеку:</p>
              <div class="w-full flex flex-wrap gap-2 pt-2">
                <FilterButton
                  v-for="option in store.stackOptions"
                  :key="option.value"
                  :label="option.label"
                  :filter-value="option.value"
                  :active-filter="activeFilter"
                  @click="handleFilterClick"
                />
              </div>
            </div>

            <!-- Карточки -->
            <div class="w-full flex-1 md:pr-2 md:overflow-y-auto">
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card
                  v-for="task in filteredTasks"
                  :key="task.id"
                  :id="task.id"
                  :title="task.title"
                  :stack="task.stack"
                  :description="task.description"
                  @delete="handleTaskDelete"
                />
              </div>

              <!-- Заглушка -->
              <div v-if="filteredTasks.length === 0"
                   class="w-full text-center text-gray-600 bg-white/80 border border-orange-400 rounded-sm py-8 px-3 mt-8">
                {{ activeFilter === 'all'
                ? 'Ни одной задачи не создано'
                : `Нет задач по стеку "${activeFilter}"` }}
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>

    <!-- Уведомление -->
    <Toast ref="notificationRef" />
  </div>
</template>
