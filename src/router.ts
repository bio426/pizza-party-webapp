import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "index",
		component: ()=>import("./views/index.vue"),
	},
	{
		path: "/admin",
		name: "admin",
		component: ()=>import("./views/admin.vue")
	}
]

export default createRouter({
	routes,
	history: createWebHistory(),
})
