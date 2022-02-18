<template>
	<ModalBase title="Confirmar pedido" @close-modal="$emit('closeConfirmation')">
		<div>
			<div class="flex gap-2 mb-4 p-2 bg-green-500 rounded-lg text-sm">
				<img
					class="block w-4"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p class="text-white">
					si pagarss al contado, asegurate de indicar la cantidad con la cual
					pagaras
				</p>
			</div>
			<div class="flex gap-2 mb-4 p-2 bg-green-500 rounded-lg text-sm">
				<img
					class="block w-4"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p class="text-white">
					Al pagar con Yape o Transferencia, te enviaremos los datos al numero
					de teléfono
				</p>
			</div>
			<div class="flex flex-col items-center gap-4">
				<label class="block">
					Nombre y apellido
					<input
						class="block w-56 mt-2 p-2 border border-black"
						type="text"
						placeholder="ej. Mario Merino"
					/>
				</label>
				<label class="block">
					Número de teléfono
					<input
						class="block w-56 mt-2 p-2 border border-black"
						type="text"
						placeholder="ej. 910282313"
						v-model="phone"
					/>
				</label>
				<label class="block">
					Tipo de pago
					<select
						class="block w-56 mt-2 p-2 border border-black"
						v-model="payType"
					>
						<option value="contado">Contra entrega</option>
						<option value="yape">Yape</option>
						<option value="banco">Transferencia</option>
					</select>
				</label>
				<label class="block" v-if="payType == 'contado'">
					Paga con
					<input
						class="block w-56 mt-2 p-2 border border-black"
						type="number"
						v-model="paysWith"
					/>
				</label>
			</div>
			<div class="grid grid-cols-2 gap-4 my-4">
				<span class="block text-right">Tiempo de entrega: </span>
				<span class="block font-bold">{{ totalTime }} min</span>
			</div>
			<div class="grid grid-cols-2 gap-4 my-4">
				<span class="block text-right">Direccion de entrega: </span>
				<span class="block font-bold">{{ address.name }}</span>
			</div>
			<div class="grid grid-cols-2 gap-4 my-4">
				<span class="block text-right">Costo del pedido: </span>
				<span class="block font-bold">S/ {{ price.toFixed(2) }}</span>
			</div>
			<button
				class="block w-full p-2 bg-green-500 active:bg-green-600 disabled:bg-green-600 text-white rounded-lg font-bold"
				:disabled="isSending"
				@click="sendOrder"
			>
				Confirmar pedido
			</button>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import { ref } from "vue"

import ModalBase from "./ModalBase.vue"

import { useStore } from "../../store"
import useNotyf from "../../composables/useNotyf"
import FirestoreService from "../../services/FirestoreService"

const props = defineProps({
	price: {
		type: Number,
		required: true,
	},
})
const emits = defineEmits(["closeConfirmation"])
const store = useStore()
const { notyf } = useNotyf()

let address = store.state.address
let deliveryTime = store.getters.deliveryTimeInMin
let pizzaCount = store.getters.pizzaCount

// obtener tiempo de entrega
let totalTime = ref(0)
FirestoreService.getKitchenInfo().then((info) => {
	let cookingTime = info.kitchenLoad * 10 - 10
	totalTime.value = cookingTime + deliveryTime
})

function calculateDeliveryTime() {
	let timePerPizzas
	let timePerKitchen
	let timePerTravel

	// return timePerPizzas + timePerKitchen + timePerTravel
}

let phone = ref("")
function phoneIsValid() {
	let validator = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,5}$/
	return validator.test(phone.value.trim())
}

let payType = ref("contado")
let paysWith = ref<number>(20)
function validatePaysWith() {
	if (paysWith.value <= 10) {
		return false
	} else {
		return true
	}
}

let isSending = ref(false)
async function sendOrder() {
	if (!phoneIsValid()) {
		notyf.error("Numero de telefono invalido")
		return 0
	}
	if (!validatePaysWith()) {
		notyf.error("Error en metodo de pago")
		return 0
	}
	isSending.value = true
	let items = store.state.cart
	let res = await FirestoreService.sendOrder({
		address: {
			name: store.state.address.name,
			lat: store.state.address.cords.lat,
			lng: store.state.address.cords.lng,
		},
		price: { delivery: 10, items: 15 },
		user: { name: "Bild", phone: "111222333", id: "firstUUid" },
		createdAt: new Date(),
		completed: false,
		items,
	})
	if (res) {
		isSending.value = false
		emits("closeConfirmation")
		store.commit({ type: "clearCart" })
		notyf.success("Orden enviada exitosamente")
	}
}
</script>

<style></style>
