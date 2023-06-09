import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/styles/element-plus/index.scss';
import ElementPlus from 'element-plus';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createI18n } from 'vue-i18n';
import messages from '@/lang';
import it from './lang/it';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);

const i18n = createI18n({
  locale: 'it',
  fallbackLocale: 'it',
  messages,
});
app.use(i18n);

app.use(ElementPlus, {
  locale: it,
});
app.mount('#app');
