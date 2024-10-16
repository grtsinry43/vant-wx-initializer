import './assets/global.css';

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

// vant 组件库
import 'vant/lib/index.css';
import {Button, NavBar, Tabbar, TabbarItem} from "vant";

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册组件
app.use(Button);
app.use(NavBar);
app.use(Tabbar);
app.use(TabbarItem);   

app.mount('#app')
