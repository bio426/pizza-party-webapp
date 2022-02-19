<template>
	<div>
		<div class="relative h-80 mb-4 border border-gray-400 map-marker">
			<div class="w-full h-full" ref="mapDiv"></div>
		</div>
		<h4 class="block mb-2 text-xl font-medium">Información</h4>
		<span v-if="order.id == ''">Orden sin seleccionar</span>
		<div v-else>
			<strong>Id: </strong><span>{{ order.id }}</span
			><br />
			<strong>Name: </strong><span>{{ order.user.name }}</span
			><br />
			<strong>Teléfono: </strong><span>{{ order.user.phone }}</span
			><br />
			<strong>Dirección: </strong><span>{{ order.address.name }}</span
			><br />
			<strong>Precio Items: </strong><span>{{ order.price.items }}</span
			><br />
			<strong>Precio Delivery: </strong><span>{{ order.price.delivery }}</span
			><br />
			<strong>Delivery: </strong><span>{{ order.price.delivery }}</span
			><br />
			<hr />
			<h4>Items</h4>
			<ul>
				<li v-for="item in order.items" style="margin-left: 1rem">
					x{{ item.quantity }} -{{ item.name }}
					<ul v-if="item.contains" style="margin-left: 1rem">
						<li v-if="item.contains.cheese">Con extraqueso</li>
						<li v-for="pizza in item.contains.pizza">
							{{ pizza }}
						</li>
						<li v-for="drink in item.contains.drink">
							{{ drink }}
						</li>
					</ul>
				</li>
			</ul>
			<div>
				<button @click="getCopy">Generar copy</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, PropType } from "vue"

import MapsService from "../../services/MapsService"
import { IOrder } from "../../interfaces"

const props = defineProps({
	order: {
		type: Object as PropType<IOrder>,
		required: true,
	},
})

let mapDiv = ref()
let mapInstance: google.maps.Map
let markerInstance: google.maps.Marker | null
onMounted(() => {
	mapInstance = MapsService.getMap(mapDiv.value as HTMLDivElement)
})
watch(
	() => props.order.id,
	() => {
		mapInstance.panTo({
			lat: props.order.address.lat,
			lng: props.order.address.lng,
		})

		if (markerInstance) {
			markerInstance.setMap(null)
			markerInstance = null
		}

		markerInstance = new google.maps.Marker({
			position: { lat: props.order.address.lat, lng: props.order.address.lng },
			map: mapInstance,
		})
	}
)

function getCopy() {
	let timeStr = props.order.createdAt.toTimeString().substring(0, 5)
	let userName = props.order.user.name
	let userPhone = props.order.user.phone
	let itemsPrice = props.order.price.items
	let deliveryPrice = props.order.price.delivery
	let address = props.order.address.name
	let addressLink = `https://www.google.com/maps/search/?api=1&query=${props.order.address.lat}%2C${props.order.address.lng}`
	let items = ""
	props.order.items.map((item, i) => {
		let str = ""
		if (item.quantity > 1) {
			str = str.concat(item.quantity.toString(), " ")
		}
		if (item.contains?.cheese) {
			str = str.concat(item.code, " QQQ")
		} else {
			str = str.concat(item.code, "")
		}
		if (i != props.order.items.length - 1) {
			str = str.concat(",")
		}
		items = items.concat(str)
	})
	let resultCopy = `Hora: ${timeStr}\nNombre: ${userName}\nTelefono: ${userPhone}\nPedido: ${items}\nPago: ${itemsPrice}\nDelivery: ${deliveryPrice}\nDireccion: ${address}\nLink: ${addressLink}`
	console.log(resultCopy)
}
</script>

<style>
.map-marker::after {
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
</style>
