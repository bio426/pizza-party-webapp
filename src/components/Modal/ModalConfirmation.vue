<template>
	<ModalBase title="Confirmar pedido" @close-modal="$emit('closeConfirmation')">
		<div class="CConfirmation">
			<div class="CConfirmation__alert">
				<img
					class="CConfirmation__ico"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p>
					si pagarss al contado, asegurate de indicar la cantidad con la cual
					pagaras
				</p>
			</div>
			<div class="CConfirmation__alert">
				<img
					class="CConfirmation__ico"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p>
					Al pagar con Yape o Transferencia, te enviaremos los datos al numero
					de teléfono
				</p>
			</div>
			<div class="CConfirmation__flex">
				<label class="CConfirmation__label">
					Teléfono del cliente
					<input
						class="CConfirmation__input"
						type="text"
						placeholder="ej. 910282313"
						v-model="phone"
					/>
				</label>
				<label class="CConfirmation__label">
					Tipo de pago
					<select class="CConfirmation__input" v-model="payType">
						<option value="contado">Contra entrega</option>
						<option value="yape">Yape</option>
						<option value="banco">Transferencia</option>
					</select>
				</label>
				<label class="CConfirmation__label" v-if="payType == 'contado'">
					Paga con
					<input
						class="CConfirmation__input"
						type="number"
						v-model="paysWith"
					/>
				</label>
			</div>
			<div class="CConfirmation__row">
				<span class="CConfirmation__description">Tiempo de entrega: </span>
				<span class="CConfirmation__bold">{{ totalTime }} min</span>
			</div>
			<div class="CConfirmation__row">
				<span class="CConfirmation__description">Direccion de entrega: </span>
				<span class="CConfirmation__bold">{{ address.name }}</span>
			</div>
			<div class="CConfirmation__row">
				<span class="CConfirmation__description">Costo del pedido: </span>
				<span class="CConfirmation__bold">S/ {{ price.toFixed(2) }}</span>
			</div>
			<button
				class="CConfirmation__button"
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

<style lang="scss">
.CConfirmation {
	&__alert {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border-radius: 0.5rem;
		font-size: 0.9rem;
	}

	&__ico {
		display: block;
		width: 1rem;
		height: auto;
	}

	&__flex {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	&__label {
		display: block;
		// margin-bottom: 1rem;
	}

	&__input {
		display: block;
		min-width: 14rem;
		margin-top: 0.5rem;
		padding: 0.5rem;
		// padding-left: 2rem;
		// background-image: url("../../assets/icons/info.svg");

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		&[type="number"] {
			-moz-appearance: none;
		}
	}

	&__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1rem 0;
	}

	&__description {
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
