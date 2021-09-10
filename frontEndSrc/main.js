import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/dist/index.css';
import router from './router';
import store from './store/store';

const app = createApp(App);

app.use(store);
app.use(router);

window.ENV = process.env.NODE_ENV || 'development';

// app.config.globalProperties.$store = store;
app.mount('#app');
