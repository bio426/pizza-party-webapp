<template>
	<div class="admin">
		<div class="admin__spacer"></div>
		<div class="admin__container">
			<div class="admin__grid">
				<div class="admin__box">
					<AdminOrders :orders="orders" @watch-order="viewDetails" />
				</div>
				<div class="admin__box">
					<AdminAlarm
						:alerting="orderIncoming"
						@attended="orderIncoming = false"
					/>
					<AdminDetails :order="selectedOrder" />
				</div>
			</div>
		</div>
		<div class="admin__spacer"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from "vue"

import { IOrder } from "../interfaces"

import AdminOrders from "../components/Admin/AdminOrders.vue"
import AdminAlarm from "../components/Admin/AdminAlarm.vue"
import AdminDetails from "../components/Admin/AdminDetails.vue"
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

<style lang="scss">
@import "../assets/styles/mixins";

.admin {
	@include page;

	&__container {
		width: 90%;
		margin: 0 auto;
	}

	&__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	&__box {
		padding: 1rem;
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);
	}

	&__subtitle {
		display: block;
		font-size: 1.5rem;
	}

	&__orderInfo {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	&__spacer {
		height: 5vh;
	}
}
</style>
