import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

  const stackOptions = ref([
    { value: 'all', label: 'Все' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'design', label: 'Design' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'seo', label: 'SEO' },
    { value: 'python', label: 'Python' },
    { value: 'css', label: 'CSS' }
  ])

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
    stackOptions,
    addTask,
    deleteTask,
    loadTasks
  }
})
