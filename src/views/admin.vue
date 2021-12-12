<template>
	<div class="admin">
		<div class="admin__topSpacer"></div>
		<div class="admin__container">
			<AdminAlarm
				:alerting="incomingOrders"
				@attended="incomingOrders = false"
			/>
			<div class="admin__details">
				<AdminMaps :cords="mapCords" />
				<AdminActive :order="activeOrder" />
				<AdminItems :items="activeOrder.items" />
			</div>
			<div class="admin__orders">
				<Order
					v-for="(order, i) in orders"
					:key="i"
					:order="order"
					@click="selectOrder(i)"
				/>
			</div>
		</div>
		<div class="admin__bottomSpacer"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeUnmount } from "vue"
import {
	getFirestore,
	collection,
	query,
	where,
	onSnapshot,
	orderBy,
	Timestamp,
	GeoPoint,
	Unsubscribe,
} from "firebase/firestore"

import { IOrderResponse } from "../interfaces/admin"

import AdminAlarm from "../components/AdminAlarm.vue"
import AdminMaps from "../components/AdminMaps.vue"
import AdminActive from "../components/AdminActive.vue"
import AdminItems from "../components/AdminItems.vue"
import Order from "../components/Order.vue"

export default defineComponent({
	name: "admin-view",
	components: {
		AdminAlarm,
		AdminMaps,
		AdminActive,
		AdminItems,
		Order,
	},
	setup() {
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
			activeOrder.items = order.items
		}

		return {
			mapCords,
			orders,
			selectOrder,
			activeOrder,
			incomingOrders,
		}
	},
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

	&__details {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	&__orders {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-top: 2rem;
	}

	&__topSpacer {
		height: 20vh;
	}

	&__bottomSpacer {
		height: 3rem;
	}
}
</style>
