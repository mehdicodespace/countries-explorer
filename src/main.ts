import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faSearch,
  faTimes,
  faChevronDown,
  faChevronLeft,
  faCheck,
  faMoon,
  faSun,
  faGlobe,
  faSort,
  faArrowsUpDown,
  faSpinner,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'

// Add icons to the library
library.add(
  faSearch,
  faTimes,
  faChevronDown,
  faChevronLeft,
  faCheck,
  faMoon,
  faSun,
  faGlobe,
  faSort,
  faArrowsUpDown,
  faSpinner,
  faExclamationTriangle,
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
