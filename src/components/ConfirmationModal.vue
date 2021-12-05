<template>
	<div class="Confirmation">
		<div class="Confirmation__main">
			<div class="Confirmation__head">
				<div class="Confirmation__title">Confirma tu pedido</div>
				<button class="Confirmation__close">
					<img class="Confirmation__ico" src="../assets/icons/cart.svg" />
				</button>
			</div>
			<p class="Confirmation__info">
				Tu pedido sera entregado en {{ deliveryTime }} min
			</p>
			<p>Tu pedido sera entregado en {{ address?.name }}</p>
			<p>Costo del pedido {{ confirmationPrice.toFixed(2) }}</p>
			<div class="Confirmation__buttons">
				<button class="Confirmation__button" @click="confirmOrder">
					Aceptar
				</button>
				<button @click="closeConfirmationModal" class="Confirmation__button">
					Rechazar
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from "vue"
import { useStore } from "vuex"
import {
	getFirestore,
	collection,
	addDoc,
	Timestamp,
	GeoPoint,
} from "firebase/firestore"

import { key } from "../store"
import useConfirmationModal from "../hooks/useConfirmationModal"

export default defineComponent({
	name: "ConfirmationModal",
	setup() {
		const store = useStore(key)
		const db = getFirestore()
		const { closeConfirmationModal, confirmationPrice } = useConfirmationModal()

		let address = unref(computed(() => store.state.address))
		let deliveryTime = computed(() => {
			if (!address) return 0
			return Math.round(address.travelTime / 60)
		})

		async function confirmOrder() {
			if (!address) {
				console.error("No se selecciono direccion")
				return 0
			}
			let items = store.state.cart
			let order = {
				clientAddres: address.name,
				clientCords: new GeoPoint(address.cords.lat, address.cords.lng),
				clientPhone: 999888777,
				createdAt: Timestamp.now(),
				items
			}
			let docRef = await addDoc(collection(db, "orders"), order)
			if(docRef){
				closeConfirmationModal()
			}
		}

		return {
			closeConfirmationModal,
			deliveryTime,
			address: computed(() => store.state.address),
			confirmationPrice,
			confirmOrder,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Confirmation {
	@include modal;

	&__buttons {
		display: flex;
		gap: 1rem;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
