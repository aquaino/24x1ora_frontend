import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/styles/element-plus/index.scss';
import ElementPlus from 'element-plus';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(ElementPlus);
app.mount('#app');
