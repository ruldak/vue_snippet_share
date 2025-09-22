import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import highlightPlugin from './utils/highlight'
import { setupInterceptors } from "./services/setupApi";

const app = createApp(App)

app.use(store).use(router).use(highlightPlugin)

setupInterceptors()

app.mount('#app')