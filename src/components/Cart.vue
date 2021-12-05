<template>
	<div class="Cart">
		<transition name="slide">
			<div class="Cart__main" v-if="showMain">
				<div class="Cart__head">
					<p class="Cart__info" v-if="userAddress">
						Entregar en:
						<span class="Cart__address"> {{ userAddress.name }} </span>
						<button class="Cart__changeAddress" @click="toogleMapsModal">
							Cambiar
						</button>
					</p>
					<p class="Cart__info" v-else>
						<span class="Cart__address">
							Selecciona una dirección de entrega
						</span>
						<button class="Cart__changeAddress" @click="toogleMapsModal">
							Seleccionar
						</button>
					</p>
					<button class="Cart__close" @click="toogleCart">
						<img class="Cart__ico" src="../assets/icons/close.svg" />
					</button>
				</div>
				<div class="Cart__container">
					<h4 class="Cart__title">Tu carrito</h4>
					<div class="Cart__items">
						<CartItem
							v-for="(item, index) in cart"
							:key="index"
							:item="item"
							:index="index"
						/>
					</div>
				</div>
				<div class="Cart__fixed">
					<div class="Cart__fixedPrices">
						<div class="Cart__subPrice">
							<span>Subtotal</span>
							<span>S/{{ cartPrice.toFixed(2) }}</span>
						</div>
						<div class="Cart__subPrice">
							<span>Delivery</span>
							<span>S/{{ delivery.toFixed(2) }}</span>
						</div>
						<div class="Cart__endPrice">
							<span>Total a pagar</span>
							<span>S/{{ finalPrice.toFixed(2) }}</span>
						</div>
					</div>
					<div class="Cart__fixedButtons">
						<button
							class="Cart__buttonContinue"
							@click="toogleMapsModal"
							v-if="!userAddress"
						>
							<span class="Cart__quantity">{{ cart.length }}</span>
							Elegir dirección
							<span class="Cart__price Cart__price--fixed"
								>S/ {{ finalPrice.toFixed(2) }}</span
							>
						</button>
						<button
							class="Cart__buttonContinue"
							@click="openConfirmationModal(finalPrice)"
							v-else
						>
							<span class="Cart__quantity">{{ cart.length }}</span>
							Confirmar pedido
							<span>S/ {{ finalPrice.toFixed(2) }}</span>
						</button>
						<button class="Cart__buttonBack" @click="toogleCart">
							Seguir comprando
						</button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import useCart from "../hooks/useCart"
import useMapsModal from "../hooks/useMapsModal"
import useConfirmationModal from "../hooks/useConfirmationModal"

import CartItem from "./CartItem.vue"

export default defineComponent({
	name: "Cart",
	components: {
		CartItem,
	},
	setup() {
		const store = useStore(key)
		const { toogleCart } = useCart()
		const { toogleMapsModal } = useMapsModal()
		const { openConfirmationModal } = useConfirmationModal()

		let showMain = ref(false)

		onMounted(() => (showMain.value = true))

		let userAddress = computed(() => store.state.address)

		let cartPrice = computed<number>(() => store.getters.cartPrice)
		let delivery = computed(() => {
			if (!userAddress.value) return 0
			return Math.round(userAddress.value.distance / 1000) * 1.5
		})
		let finalPrice = computed<number>(() => cartPrice.value + delivery.value)

		return {
			showMain,
			toogleCart,
			toogleMapsModal,
			cart: computed(() => store.state.cart),
			userAddress,
			cartPrice,
			delivery,
			finalPrice,
			openConfirmationModal,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Cart {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100vh;
	background: rgba($color: #000000, $alpha: 0.5);
	z-index: 10;

	&__main {
		position: absolute;
		right: 0;
		width: 90%;
		height: 100%;
		background: #fff;
	}

	&__head {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		background: lightgray;
	}

	&__info {
		display: block;
		max-width: 60%;
	}

	&__address {
		font-weight: 600;
	}

	&__changeAddress {
		margin-left: 0.2rem;
		padding: 0 0.5rem;
		background: #fff;
		border: 1px solid #000;
		border-radius: 0.5rem;
	}

	&__close {
		border: none;
		background: none;
	}

	&__title {
		padding-bottom: 1rem;
		text-align: center;
		font-size: 1.5rem;
	}

	&__items {
		display: flex;
		flex-direction: column;
		height: 55vh;
		overflow-y: auto;
	}

	&__container {
		padding: 1rem;
	}

	&__fixed {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 1rem;
		border-top: 1px solid #000;
	}

	&__fixedPrices {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	&__subPrice {
		display: flex;
		justify-content: space-between;
	}

	&__endPrice {
		display: flex;
		justify-content: space-between;
		padding-top: 0.5rem;
		border-top: 1px solid #000;
		font-size: 1.2rem;
		font-weight: 600;
	}

	&__fixedButtons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-top: 1rem;
	}

	&__buttonContinue {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0.5rem 1rem;
		background: $red;
		color: #fff;
		border: none;
		border-radius: 1rem;
		font-size: 1rem;
		font-weight: 600;
	}

	&__buttonBack {
		display: block;
		width: 100%;
		padding: 0.5rem 1rem;
		background: none;
		color: $red;
		border: 2px solid $red;
		border-radius: 1rem;
		font-size: 1rem;
		font-weight: 600;
	}

	&__quantity {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 2rem;
		background: #fff;
		color: $red;
		border-radius: 50%;
		font-size: 1rem;
		font-weight: 600;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}

	@media (min-width: 768px) {
		&__main {
			width: 70%;
		}
	}

	@media (min-width: 1024px) {
		&__main {
			width: 40%;
		}
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}
</style>
