import { createRouter, createWebHistory } from 'vue-router';
import Registers from '../views/Registers.vue';

const routes = [
	{
		path: '/',
		name: 'Registers',

		/* route level code-splitting
       this generates a separate chunk (about.[hash].js) for this route
       which is lazy-loaded when the route is visited. */
		component: Registers,
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import(/* webpackChunkName: "ome" */ '../views/Home.vue'),
	},
	{
		path: '/about',
		name: 'About',

		/* route level code-splitting
       this generates a separate chunk (about.[hash].js) for this route
       which is lazy-loaded when the route is visited. */
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
