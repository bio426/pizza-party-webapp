import { createApp } from "vue"

import App from "./App.vue"
import router from "./router"

import "./assets/styles/index.css"
import "notyf/notyf.min.css"

createApp(App).use(router).mount("#app")
