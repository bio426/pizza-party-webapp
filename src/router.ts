import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "index",
		component: ()=>import("./views/index.vue"),
		children: [
			{
				path: "/login",
				component: ()=>import("./components/Login.vue")
			},
			{
				path: "/register",
				component: ()=>import("./components/Register.vue")
			}
		]
	},
	{
		path: "/user",
		name: "user",
		component: ()=>import("./views/user.vue")
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
