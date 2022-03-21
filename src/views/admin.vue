<template>
	<div class="relative w-full min-h-screen bg-page bg-repeat">
		<div class="h-10"></div>
		<div class="w-9/10 mx-auto">
			<div class="grid grid-cols-2 gap-8 mb-8">
				<div class="p-4 bg-white rounded-xl shadow-xl">
					<AdminOrders :orders="orders" @watch-order="viewDetails" />
				</div>
				<div class="p-4 bg-white rounded-xl shadow-xl">
					<AdminAlarm
						:alerting="orderIncoming"
						@attended="orderIncoming = false"
					/>
					<AdminDetails :order="selectedOrder" />
				</div>
			</div>
			<div class="mb-8 p-4 bg-white rounded-xl shadow-xl">
				<AdminStatus />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from "vue"

import { IOrder } from "../interfaces"

import AdminOrders from "../components/Admin/AdminOrders.vue"
import AdminAlarm from "../components/Admin/AdminAlarm.vue"
import AdminDetails from "../components/Admin/AdminDetails.vue"
import AdminStatus from "../components/Admin/AdminStatus.vue"
import FirestoreService from "../services/FirestoreService"

// Get Orders
let orders = ref<IOrder[]>([])
let firstGet = true
let orderIncoming = ref(false)
let unsubscribe = FirestoreService.subscribeOrders((updatedOrders) => {
	orders.value = updatedOrders
	if (firstGet) {
		firstGet = false
		return
	}
	orderIncoming.value = true
})
onBeforeUnmount(() => unsubscribe())

function viewDetails(index: number) {
	let toSelect = orders.value[index]
	selectedOrder.id = toSelect.id
	selectedOrder.user = { ...toSelect.user }
	selectedOrder.address = { ...toSelect.address }
	selectedOrder.price = { ...toSelect.price }
	selectedOrder.completed = toSelect.completed
	selectedOrder.createdAt = toSelect.createdAt
	selectedOrder.items = toSelect.items
}

let selectedOrder = reactive<IOrder>({
	id: "",
	user: { name: "", phone: "" },
	address: { name: "", lat: 0, lng: 0 },
	price: { items: 0, delivery: 0 },
	completed: false,
	createdAt: new Date(),
	items: [],
})
</script>

<style>
.bg-page {
	background-image: url("../assets/images/fondoPizza.webp");
}
</style>
