import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./store"; // [TEST] normally execute when store is a named export

const app = createApp(App);
app.use(store);
app.mount("#app");
