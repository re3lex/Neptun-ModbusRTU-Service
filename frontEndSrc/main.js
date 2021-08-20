import { createApp } from 'vue';
import {
	ElDropdown,
	ElDropdownItem,
	ElDropdownMenu,

	ElCard,

	ElForm,
	ElFormItem,
	ElSelect,
	ElOption,
	ElInputNumber,
	ElSwitch,
	ElCollapse,
	ElCollapseItem,

} from 'element-plus';

import App from './App.vue';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router';
import store from './store';

const components = [
	ElDropdown,

	ElDropdownItem,
	ElDropdownMenu,

	ElCard,
	ElForm,
	ElFormItem,
	ElSelect,
	ElOption,
	ElInputNumber,
	ElSwitch,
	ElCollapse,
	ElCollapseItem,
];

const app = createApp(App);

components.forEach((component) => {
	app.component(component.name, component);
});

app.use(store);
app.use(router);

// app.config.globalProperties.$store = store;
app.mount('#app');
