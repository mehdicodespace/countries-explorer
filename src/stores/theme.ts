import { defineStore } from 'pinia'
import { ref, onMounted, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = savedTheme ? savedTheme === 'dark' : systemPrefersDark
    applyTheme()
  })

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '')
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  watch(isDark, applyTheme)

  return { isDark, toggleTheme }
})
