<template>
	<div class="fixed top-0 w-full h-screen bg-modal z-20">
		<transition name="slide">
			<div
				class="absolute right-0 w-9/10 md:w-7/10 lg:w-2/5 h-full bg-white"
				v-if="showMain"
			>
				<div class="flex justify-between p-4 bg-gray-300">
					<p class="block w-3/5" v-if="userAddress.name != ''">
						Entregar en:
						<span class="font-bold"> {{ userAddress.name }} </span>
						<button
							class="ml-1 px-2 bg-white border border-black rounded-lg"
							@click="showModalAddress = true"
						>
							Cambiar
						</button>
					</p>
					<p class="block w-3/5" v-else>
						<span class="font-bold"> Selecciona una dirección de entrega </span>
						<button
							class="ml-1 px-2 bg-white border border-black rounded-lg"
							@click="showModalAddress = true"
						>
							Seleccionar
						</button>
					</p>
					<button @click="toogleCart">
						<img class="block w-6" src="../assets/icons/close.svg" />
					</button>
				</div>
				<div class="p-4">
					<h4 class="mb-4 text-center text-2xl">Tu carrito</h4>
					<div class="flex flex-col h-[50vh] overflow-y-auto">
						<div
							class="flex justify-center items-center gap-2 w-full h-full text-center font-bold"
							v-if="cart.length == 0"
						>
							<img class="block w-6" src="../assets/icons/empty.svg" />
							Aun no hay items agregados
						</div>
						<CartItem
							v-for="(item, index) in cart"
							:key="index"
							:item="item"
							:index="index"
						/>
					</div>
				</div>
				<div class="absolute bottom-0 w-full p-4 border-t border-black">
					<div class="flex flex-col gap-2 mb-2">
						<div class="flex justify-between">
							<span>Subtotal</span>
							<span>S/ {{ cartPrice.toFixed(2) }}</span>
						</div>
						<div class="flex justify-between">
							<span>Delivery</span>
							<span>S/ {{ deliveryPrice.toFixed(2) }}</span>
						</div>
						<div
							class="flex justify-betweenflex justify-between pt-2 border-t border-black text-xl font-bold"
						>
							<span>Total a pagar</span>
							<span>S/ {{ finalPrice.toFixed(2) }}</span>
						</div>
					</div>
					<button
						class="flex justify-between items-center w-full mb-4 py-2 px-4 bg-red-500 text-white rounded-lg font-bold"
						@click="showModalAddress = true"
						v-if="userAddress.name == ''"
					>
						<span
							class="flex justify-center items-center w-6 h-6 mr-8 bg-white text-red-500 rounded-full font-bold"
							>{{ cart.length }}</span
						>
						Seleccionar dirección
						<span>S/ {{ finalPrice.toFixed(2) }}</span>
					</button>
					<button
						class="flex justify-between items-center w-full mb-4 py-2 px-4 bg-red-500 text-white rounded-lg font-bold"
						@click="finishOrder"
						v-else
					>
						<span
							class="flex justify-center items-center w-6 h-6 mr-8 bg-white text-red-500 rounded-full font-bold"
							>{{ cart.length }}</span
						>
						Confirmar pedido
						<span>S/ {{ finalPrice.toFixed(2) }}</span>
					</button>
					<button
						class="block w-full py-2 px-4 bg-transparent text-red-500 border-2 border-red-500 rounded-lg font-bold"
						@click="toogleCart"
					>
						Seguir comprando
					</button>
				</div>
			</div>
		</transition>
		<ModalAddress
			v-if="showModalAddress"
			@close-selector="showModalAddress = false"
		/>
		<ModalUnavailable
			v-if="showModalUnavailable"
			@close-unavailable="showModalUnavailable = false"
		/>
		<ModalConfirmation
			:price="finalPrice"
			v-if="showModalConfirmation"
			@close-confirmation="showModalConfirmation = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

import useCartStore from "../composables/useCartStore"
import useKitchenStore from "../composables/useKitchenStore"
import useUserStore from "../composables/useUserStore"
import useCart from "../composables/useCart"
import useNotyf from "../composables/useNotyf"

import CartItem from "./CartItem.vue"
import ModalAddress from "./Modal/ModalAddress.vue"
import ModalUnavailable from "./Modal/ModalUnavailable.vue"
import ModalConfirmation from "./Modal/ModalConfirmation.vue"

const { cart, cartPrice } = useCartStore()
const { kitchenStore } = useKitchenStore()
const { address, deliveryPrice } = useUserStore()
const { toogleCart } = useCart()
const { notyf } = useNotyf()
// const cart = computed(() => store.state.cart)

let showMain = ref(false)

onMounted(() => (showMain.value = true))

// let userAddress = computed(() => store.state.address)
let userAddress = address

// let cartPrice = computed<number>(() => store.getters.cartPrice)
let finalPrice = computed<number>(() => cartPrice.value + deliveryPrice.value)

function finishOrder() {
	if (cart.value.length < 1) {
		notyf.error("No hay productos en el carrito")
		return
	}
	if (!kitchenStore.kitchenActive) {
		showModalUnavailable.value = true
		return
	}
	showModalConfirmation.value = true
}

let showModalAddress = ref(false)
let showModalUnavailable = ref(false)
let showModalConfirmation = ref(false)
</script>

<style>
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}
</style>
