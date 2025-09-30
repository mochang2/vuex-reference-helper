import { createApp } from "vue";
import App from "./App.vue";
import store from "#store2"; // [TEST] normally execute when store is a default export, normally execute when the imported path is absolute(1)

const app = createApp(App);
app.use(store);
app.mount("#app");
