<template>
	<div class="admin">
		<div class="admin__topSpacer"></div>
		<div class="admin__auth" v-if="!authenticated">
			<h4>introduce tus credenciales</h4>
			<label>
				Usuario
				<input class="admin__input" type="text" v-model="username" />
			</label>
			<label>
				Contraseña
				<input class="admin__input" type="text" v-model="password" />
			</label>
			<button class="admin__btn" @click="login">Ingresar</button>
			<p>{{ loginError }}</p>
		</div>
		<div class="admin__container" v-else>
			<AdminAlarm
				:alerting="incomingOrders"
				@attended="incomingOrders = false"
			/>
			<AdminStatus />
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
	getDocs,
	onSnapshot,
	orderBy,
	Timestamp,
	GeoPoint,
	Unsubscribe,
} from "firebase/firestore"

import { IOrderResponse } from "../interfaces/admin"

import AdminAlarm from "../components/AdminAlarm.vue"
import AdminStatus from "../components/AdminStatus.vue"
import AdminMaps from "../components/AdminMaps.vue"
import AdminActive from "../components/AdminActive.vue"
import AdminItems from "../components/AdminItems.vue"
import Order from "../components/Order.vue"

export default defineComponent({
	name: "admin-view",
	components: {
		AdminAlarm,
		AdminStatus,
		AdminMaps,
		AdminActive,
		AdminItems,
		Order,
	},
	setup() {
		const db = getFirestore()

		// login
		let authenticated = ref(false)
		let username = ref("")
		let password = ref("")
		let loginError = ref("")
		async function login() {
			let usersRef = collection(db, "admin")
			let q = query(
				usersRef,
				where("username", "==", username.value),
				where("password", "==", password.value)
			)
			let snap = await getDocs(q)
			if (snap.empty) {
				// usuario inexistente
				loginError.value = "Usuario inexistente"
			} else {
				// logear
				authenticated.value = true
			}
			username.value = ""
			password.value = ""
		}

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
			authenticated,
			username,
			password,
			loginError,
			login,
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

	&__auth {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 90%;
		margin: 0 auto;
	}

	&__input {
		font-size: 1.2rem;
	}

	&__btn {
		padding: 0.2rem;
		font-size: 1.2rem;
	}

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

	&__topSpacer {
		height: 20vh;
	}

	&__bottomSpacer {
		height: 3rem;
	}
}
</style>
