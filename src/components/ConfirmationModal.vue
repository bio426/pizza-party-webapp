<template>
	<div class="Confirmation">
		<div class="Confirmation__main">
			<div class="Confirmation__head">
				<div class="Confirmation__title">Confirma tu pedido</div>
				<button class="Confirmation__close">
					<img class="Confirmation__ico" src="../assets/icons/cart.svg" />
				</button>
			</div>
			<div class="Confirmation__row">
				<span class="Confirmation__info">Tiempo aproximado de entrega: </span>
				<span class="Confirmation__info Confirmation__info--right"
					>{{ deliveryTime }} min</span
				>
			</div>
			<div class="Confirmation__row">
				<span class="Confirmation__info">Direccion de entrega: </span>
				<span class="Confirmation__info Confirmation__info--right">{{
					address?.name
				}}</span>
			</div>
			<div class="Confirmation__row">
				<span class="Confirmation__info">Costo del pedido: </span>
				<span class="Confirmation__info Confirmation__info--right"
					>S/ {{ confirmationPrice.toFixed(2) }}</span
				>
			</div>
			<div class="Confirmation__row">
				<span class="Confirmation__info">Numero de teléfono: </span>
				<input
					class="Confirmation__phone"
					type="text"
					placeholder="ej. 994 012 627"
					v-model="phone"
				/>
			</div>
			<div class="Confirmation__buttons">
				<button
					class="Confirmation__button"
					@click="confirmOrder"
					:disabled="sendingOrder"
				>
					{{ sendingOrder ? "Enviando..." : "Confirmar orden" }}
				</button>
				<button
					@click="closeConfirmationModal"
					class="Confirmation__button Confirmation__button--red"
				>
					Cancelar
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, unref, ref } from "vue"
import { useStore } from "vuex"
import {
	getFirestore,
	collection,
	addDoc,
	Timestamp,
	GeoPoint,
} from "firebase/firestore"

import { key } from "../store"
import useCart from "../hooks/useCart"
import useConfirmationModal from "../hooks/useConfirmationModal"
import useNotification from "../hooks/useNotification"

export default defineComponent({
	name: "ConfirmationModal",
	setup() {
		const store = useStore(key)
		const db = getFirestore()
		const { closeConfirmationModal, confirmationPrice } = useConfirmationModal()
		const { notyf } = useNotification()
		const { toogleCart } = useCart()

		let address = unref(computed(() => store.state.address))
		let deliveryTime = computed(() => {
			if (!address) return 0
			return Math.round(address.travelTime / 60)
		})

		let sendingOrder = ref(false)
		let phone = ref("")

		async function confirmOrder() {
			if (!address) return 0
			let validPhone =
				/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,5}$/.test(
					phone.value.trim()
				)
			if (!validPhone) {
				notyf.error("Número de teléfono no valido")
				return 0
			}
			let items = store.state.cart
			let order = {
				clientAddress: address.name,
				clientCords: new GeoPoint(address.cords.lat, address.cords.lng),
				clientPhone: phone.value.trim(),
				createdAt: Timestamp.now(),
				items,
			}
			sendingOrder.value = true
			let docRef = await addDoc(collection(db, "orders"), order)
			if (docRef) {
				sendingOrder.value = false
				notyf.success("Orden recibida exitosamente")
				store.commit({ type: "clearCart" })
				toogleCart()
				closeConfirmationModal()
			}
		}

		return {
			closeConfirmationModal,
			deliveryTime,
			address: computed(() => store.state.address),
			confirmationPrice,
			phone,
			confirmOrder,
			sendingOrder,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Confirmation {
	@include modal;

	&__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1rem 0;
	}

	&__info {
		display: block;
		text-align: right;

		&--right {
			text-align: left;
			font-weight: 600;
		}
	}

	&__phone {
		padding: 0.2rem;
	}

	&__buttons {
		display: flex;
		gap: 1rem;
	}

	&__button:disabled {
		background: gray;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
