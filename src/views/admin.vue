<template>
	<div class="admin">
		<div class="admin__spacer"></div>
		<div class="admin__container">
			<div class="admin__details">
				<div class="admin__box">
					<div class="admin__maps" ref="mapsDiv"></div>
				</div>
				<div class="admin__box">
					{{ activeOrder }}
				</div>
				<div class="admin__box">
					{{ activeItems }}
				</div>
			</div>
			<div class="admin__orders">
				<div
					class="admin__box"
					v-for="(order, i) in orders"
					:key="i"
					@click="selectOrder(order)"
				>
					{{ order }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue"
import { Loader } from "@googlemaps/js-api-loader"
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	Timestamp,
	QuerySnapshot,
} from "firebase/firestore"

import { ICartItem } from "../interfaces/cart"

interface IOrderResponse {
	id: string
	clientAddress: string
	clientPhone: number
	clientCords: object
	createdAt: number
	items: ICartItem[]
}

export default defineComponent({
	name: "admin-view",
	setup() {
		const db = getFirestore()

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

		let orders = ref<IOrderResponse[]>([])
		async function getOrders() {
			let today = new Date()
			let yesterday = today.setDate(today.getDate() - 1)
			let q = query(
				collection(db, "orders"),
				where("createdAt", ">=", Timestamp.fromMillis(yesterday))
			)

			let snap = (await getDocs(q)) as QuerySnapshot<IOrderResponse>
			snap.forEach((doc) => {
				orders.value.push({
					...doc.data(),
					id: doc.id,
				})
			})
		}
		getOrders()

		let activeOrder = reactive({
			clientAddres: "",
			clientPhone: 0,
			createdAt: 0,
		})
		let activeItems = ref([])

		function selectOrder(order: any) {
			map.panTo({
				lat: order.clientCords.latitude as number,
				lng: order.clientCords.longitude as number,
			})
			activeOrder.clientAddres = order.clientAddres
			activeOrder.clientPhone = order.clientPhone
			activeOrder.createdAt = order.createdAt

			activeItems.value = order.items
		}

		return {
			mapsDiv,
			orders,
			selectOrder,
			activeOrder,
			activeItems,
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

	&__orders {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-top: 2rem;
	}

	&__spacer {
		height: 20vh;
	}
}
</style>
