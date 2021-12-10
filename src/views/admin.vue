<template>
	<div class="admin">
		<div class="admin__topSpacer"></div>
		<div class="admin__container">
			<AdminAlarm
				:alerting="incomingOrders"
				@attended="incomingOrders = false"
			/>
			<div class="admin__details">
				<div class="admin__box">
					<div class="admin__maps" ref="mapsDiv"></div>
				</div>
				<AdminActive :order="activeOrder" />
				<div class="admin__box">
					<div v-for="(item, i) in activeOrder.items" :key="i">
						x{{ item.quantity }}--{{ item.name }}
						<ul v-if="item.contains">
							<li class="admin__nested" v-if="item.contains.cheese">
								Con extra queso
							</li>
							<li class="admin__nested" v-for="pizza in item.contains.pizza">
								{{ pizza }}
							</li>
							<li class="admin__nested" v-for="drink in item.contains.drink">
								{{ drink }}
							</li>
						</ul>
						<hr />
					</div>
				</div>
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
import { defineComponent, ref, reactive, onMounted, onBeforeUnmount } from "vue"
import { Loader } from "@googlemaps/js-api-loader"
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
import AdminActive from "../components/AdminActive.vue"
import Order from "../components/Order.vue"

export default defineComponent({
	name: "admin-view",
	components: {
		AdminAlarm,
		AdminActive,
		Order,
	},
	setup() {
		const db = getFirestore()

		// Load maps view
		const loader = new Loader({
			apiKey: "AIzaSyDm6e078Cvj-HLlRZWBI3B540JexD1CyJk",
			version: "weekly",
			libraries: ["places"],
		})
		let mapsDiv = ref<HTMLDivElement>()
		let map: google.maps.Map
		onMounted(async () => {
			await loader.load()
			map = new google.maps.Map(mapsDiv.value as HTMLDivElement, {
				center: {
					lat: -12.067664200000008,
					lng: -77.0716884,
				},
				zoom: 18,
				disableDefaultUI: true,
			})
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
			map.panTo({
				lat: order.clientCords.latitude as number,
				lng: order.clientCords.longitude as number,
			})
			activeOrder.id = order.id
			activeOrder.clientAddress = order.clientAddress
			activeOrder.clientCords = order.clientCords
			activeOrder.clientPhone = order.clientPhone
			activeOrder.createdAt = order.createdAt
			activeOrder.items = order.items
		}

		return {
			mapsDiv,
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

	&__alert {
		width: 100%;
	}

	&__box {
		padding: 1rem;
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);
	}

	&__details {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	&__maps {
		height: 20rem;

		&::after {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 1rem;
			height: 1rem;
			border: 2px solid red;
			border-radius: 50%;
		}
	}

	&__nested {
		margin-left: 1.5rem;
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
