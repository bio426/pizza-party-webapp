<template>
	<div class="Cart">
		<div class="Cart__main">
			<div class="Cart__head">
				<p class="Cart__address" v-if="userAddress">
					Entregar en:
					<span class="Cart__strong"> {{ userAddress.name }} </span>
				</p>
				<p class="Cart__address" v-else>
					<span class="Cart__strong">
						Selecciona una dirección de entrega
					</span>
				</p>
				<button class="Cart__close" @click="toogleCart">
					<img class="Cart__ico" src="../assets/icons/close.svg" />
				</button>
			</div>
			<div class="Cart__container Cart__container--main">
				<h4 class="Cart__title">Tu carrito</h4>
				<div class="Cart__items">
					<CartItem
						v-for="(item, index) in cart"
						:key="index"
						:item="item"
						:index="index"
					/>
				</div>
				<div class="Cart__container Cart__container--prices">
					<span>Subtotal</span>
					<span>S/{{ cartPrice.toFixed(2) }}</span>
				</div>
				<div class="Cart__container Cart__container--prices">
					<span>Delivery</span>
					<span>S/{{ delivery.toFixed(2) }}</span>
				</div>
				<div class="Cart__container Cart__container--endprice">
					<span class="Cart__price">Total a pagar</span>
					<span class="Cart__price">S/{{ finalPrice.toFixed(2) }}</span>
				</div>
			</div>
			<div class="Cart__fixed">
				<button
					class="Cart__button Cart__button--pay"
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
					class="Cart__button Cart__button--pay"
					@click="openConfirmationModal(finalPrice)"
					v-else
				>
					<span class="Cart__quantity">{{ cart.length }}</span>
					Confirmar pedido
					<span class="Cart__price Cart__price--fixed"
						>S/ {{ finalPrice.toFixed(2) }}</span
					>
				</button>
				<button class="Cart__button">Seguir comprando</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
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

		let userAddress = computed(() => store.state.address)

		let cartPrice = computed<number>(() => store.getters.cartPrice)
		let delivery = computed(() => {
			if (!userAddress.value) return 0
			return Math.round(userAddress.value.distance / 1000) * 1.5
		})
		let finalPrice = computed<number>(() => cartPrice.value + delivery.value)

		return {
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
		height: 480px;
		overflow-y: auto;
		border-bottom: 1px solid #000;
	}

	&__container {
		&--main {
			padding: 1rem;
		}

		&--prices {
			display: flex;
			justify-content: space-between;
			padding: 0.5rem 0;
		}

		&--endprice {
			display: flex;
			justify-content: space-between;
			border-top: 1px solid #000;
			padding: 0.5rem 0;
		}
	}

	&__address {
		display: block;
		max-width: 60%;
	}

	&__strong {
		font-weight: 600;
	}

	&__button {
		display: block;
		width: 100%;
		padding: 0.5rem 1rem;
		background: none;
		color: $red;
		border: 2px solid $red;
		border-radius: 1rem;
		font-size: 1rem;
		font-weight: 600;

		&--pay {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1rem;
			background: $red;
			color: #fff;
		}
	}

	&__price {
		font-size: 1.2rem;
		font-weight: 600;

		&--fixed {
			font-size: 1rem;
			font-weight: 600;
		}
	}

	&__fixed {
		position: fixed;
		bottom: 0;
		width: 90%;
		padding: 1rem;
		border-top: 1px solid #000;
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
}

@media (min-width: 768px) {
	.Cart {
		&__main {
			width: 70%;
		}

		&__fixed {
			width: 70%;
		}
	}
}

@media (min-width: 1024px) {
	.Cart {
		&__main {
			width: 40%;
		}

		&__fixed {
			width: 40%;
		}
	}
}
</style>
