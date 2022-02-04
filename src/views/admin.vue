<template>
	<div class="admin">
		<div class="admin__spacer"></div>
		<div class="admin__container">
			<div class="admin__flex">
				<AdminAlarm
					:alerting="incomingOrders"
					@attended="incomingOrders = false"
				/>
				<AdminStatus />
			</div>
			<div class="admin__details">
				<AdminMaps :cords="mapCords" />
				<AdminActive :order="activeOrder" />
				<AdminItems :items="activeOrder.items" />
			</div>
			<h2 class="admin__subtitle">Ordenes Pendientes</h2>
			<div class="admin__orders">
				<div class="admin__noOrders" v-if="orders.length == 0">
					Sin ordenes para mostrar...
				</div>
				<Order
					v-for="(order, i) in orders"
					:key="i"
					:order="order"
					@click="selectOrder(i)"
				/>
			</div>
		</div>
		<div class="admin__spacer"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from "vue"
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	onSnapshot,
	orderBy,
	Timestamp,
	GeoPoint,
	Unsubscribe,
} from "firebase/firestore"

import { IOrderResponse } from "../interfaces"

import AdminAlarm from "../components/Admin/AdminAlarm.vue"
import AdminStatus from "../components/Admin/AdminStatus.vue"
import AdminMaps from "../components/Admin/AdminMaps.vue"
import AdminActive from "../components/Admin/AdminActive.vue"
import AdminItems from "../components/Admin/AdminItems.vue"
import Order from "../components/Order.vue"

const db = getFirestore()

let mapCords = reactive<google.maps.LatLngLiteral>({
	lat: -12.067664200000008,
	lng: -77.0716884,
})

// Get Orders
let orders = ref<IOrderResponse[]>([])
let unsubscribe: Unsubscribe
let firstGet = true
let incomingOrders = ref(false)
let todayInit = new Date()
todayInit.setHours(0, 0, 0, 0)
let q = query(
	collection(db, "orders"),
	where("createdAt", ">=", Timestamp.fromDate(todayInit)),
	orderBy("createdAt", "desc")
)
unsubscribe = onSnapshot(q, (querySnapshot) => {
	orders.value = []
	querySnapshot.forEach((doc) => {
		let data = { ...doc.data(), id: doc.id } as IOrderResponse
		orders.value.push(data)
	})
	if (firstGet) {
		firstGet = false
		return
	}
	incomingOrders.value = true
})
onBeforeUnmount(() => unsubscribe())

// Handle order view
let timePlaceholder = Timestamp.fromDate(todayInit)
let cordsPlaceholder = new GeoPoint(-12.067664200000008, -77.0716884)
let activeOrder = reactive<IOrderResponse>({
	id: "",
	clientAddress: "",
	clientCords: cordsPlaceholder,
	clientPhone: 0,
	createdAt: timePlaceholder,
	payment: {
		type: ""
	},
	items: [],
})

function selectOrder(index: number) {
	let order = orders.value[index]
	mapCords.lat = order.clientCords.latitude
	mapCords.lng = order.clientCords.longitude

	activeOrder.id = order.id
	activeOrder.clientAddress = order.clientAddress
	activeOrder.clientCords = order.clientCords
	activeOrder.clientPhone = order.clientPhone
	activeOrder.createdAt = order.createdAt
	activeOrder.payment = order.payment
	activeOrder.items = order.items
}
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.admin {
	@include page;

	&__container {
		width: 90%;
		margin: 0 auto;
	}

	&__flex {
		display: flex;
		gap: 1rem;
	}

	&__details {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	&__orders {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	&__subtitle {
		display: block;
		margin-top: 1rem;
		font-size: 1.5rem;
	}

	&__noOrders {
		grid-column: 1 / span 4;
		font-size: 1.5rem;
		text-align: center;
	}

	&__spacer {
		height: 20vh;
	}
}
</style>
