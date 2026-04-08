import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { STACK_OPTIONS } from '@/constants/stacks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

  const loadTasks = () => {
    const saved = localStorage.getItem('tasks')
    if (saved) tasks.value = JSON.parse(saved)
  }

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  watch(tasks, saveTasks, { deep: true })

  const addTask = (newTask) => {
    tasks.value.push({
      id: Date.now(),
      ...newTask
    })
  }

  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return {
    tasks,
    stackOptions: STACK_OPTIONS,
    addTask,
    deleteTask,
    loadTasks
  }
})
