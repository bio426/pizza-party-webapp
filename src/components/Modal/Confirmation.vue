<template>
	<BaseModal title="Confirmar pedido" @close-modal="$emit('closeConfirmation')">
		<div class="CConfirmation">
			<div class="CConfirmation__row">
				<span class="CConfirmation__label">Tiempo de entrega: </span>
				<span class="CConfirmation__bold">{{ totalTime }} min</span>
			</div>
			<div class="CConfirmation__row">
				<span class="CConfirmation__label">Direccion de entrega: </span>
				<span class="CConfirmation__bold">{{ address.name }}</span>
			</div>
			<div class="CConfirmation__row">
				<span class="CConfirmation__label">Costo del pedido: </span>
				<span class="CConfirmation__bold">S/ {{ price.toFixed(2) }}</span>
			</div>
			<div class="CConfirmation__row">
				<span class="CConfirmation__label">Numero de teléfono: </span>
				<span class="CConfirmation__bold">
					<input type="text" v-model="phone" />
				</span>
			</div>
			<button
				class="CConfirmation__button"
				:disabled="isSending"
				@click="sendOrder"
			>
				Confirmar pedido
			</button>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue"

import BaseModal from "./BaseModal.vue"

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

// obtener tiempo de entrega
let totalTime = ref(0)

FirestoreService.getKitchenInfo().then((info) => {
	let cookingTime = info.kitchenLoad * 7
	totalTime.value = cookingTime + deliveryTime
})

// obtener precio de entrega

let phone = ref("")
function phoneIsValid() {
	let validator = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,5}$/
	return validator.test(phone.value.trim())
}

// implementar funcion para disablear boton al enviar order
let isSending = ref(false)
async function sendOrder() {
	if (!phoneIsValid()) {
		notyf.error("Numero de telefono invalido")
		return 0
	}
	isSending.value = true
	let items = store.state.cart
	let order = {
		clientAddress: store.state.address.name,
		clientPhone: phone.value.trim(),
		clientCords: {
			lat: store.state.address.cords.lat,
			lng: store.state.address.cords.lng,
		},
		items,
	}
	let res = await FirestoreService.sendOrder(order)
	if (res) {
		isSending.value = false
		emits("closeConfirmation")
		store.commit({ type: "clearCart" })
		notyf.success("Orden enviada exitosamente")
	}
}
</script>

<style lang="scss">
.CConfirmation {
	&__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1rem 0;
	}

	&__label {
		display: block;
		text-align: right;
	}

	&__bold {
		display: block;
		text-align: left;
		font-weight: 600;
	}

	&__button {
		display: block;
		width: 100%;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;

		&:active {
			background: darken($color: $green, $amount: 10%);
		}
		&:disabled {
			background: darken($color: $green, $amount: 10%);
		}
	}
}
</style>
