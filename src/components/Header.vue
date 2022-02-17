<template>
	<div class="Header">
		<div class="Header__container Header__container--main">
			<router-link to="/">
				<img class="Header__logo" src="../assets/images/logoLetras.webp" />
			</router-link>
			<div class="Header__container Header__container--links" v-if="isLarge">
				<a class="Header__link" href="/#combosSection">Menu</a>
				<router-link class="Header__link" to="/admin">Admin</router-link>
			</div>
			<div class="Header__container Header__container--right" v-if="isLarge">
				<a href="tel:555-555-5555" class="Header__link Header__link--telf">
					<img
						class="Header__ico Header__ico--small"
						src="../assets/icons/phone-solid.svg"
					/>
					Llamános <br />
					973-942-055
				</a>
				<button class="Header__button Header__button--cart" @click="toogleCart">
					<img
						class="Header__ico Header__ico--small"
						src="../assets/icons/cart.svg"
					/>
					S/ {{ cartPrice.toFixed(2) }}
				</button>
			</div>
			<div class="Header__container Header__container--right" v-else>
				<a href="tel:555-555-5555" class="Header__button">
					<img class="Header__ico" src="../assets/icons/phone.svg" />
				</a>
				<router-link class="Header__button" to="/">
					<img class="Header__ico" src="../assets/icons/user.svg" />
				</router-link>
				<button class="Header__button" @click="$emit('showSidebar')">
					<img class="Header__ico" src="../assets/icons/menu.svg" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { useStore } from "../store"
import useLargeScreen from "../composables/useLargeScreen"
import useCart from "../composables/useCart"

const store = useStore()
const { isLarge } = useLargeScreen()
const { toogleCart } = useCart()
const cartPrice = computed<number>(() => store.getters.cartPrice)
</script>

<style lang="scss">
.Header {
	background: #fff;
	border-bottom: 1px solid #000;

	@media (min-width: 1024px) {
		// position: absolute;
		// top: 5rem;
		// left: 50%;
		// transform: translateX(-50%);
		// width: 80%;
		// border: none;
		// border-radius: 1rem;
		// z-index: 10;
	}

	&__container {
		&--main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
			width: 90%;
			margin: 0 auto;
			padding: 0.5rem 0;
		}

		&--links {
			flex: 1;
			display: flex;
			justify-content: start;
			gap: 1rem;
		}

		&--right {
			display: flex;
			gap: 1rem;
		}
	}

	&__logo {
		display: block;
	}

	&__link {
		display: block;
		color: #000;
		text-decoration: none;
		font-size: 1rem;
		font-weight: 600;

		&--telf {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.2rem 1rem;
			background: $green;
			color: #fff;
			border-radius: 0.5rem;
			text-decoration: none;
			font-weight: 500;
		}
	}

	&__button {
		display: flex;
		justify-content: center;
		align-items: center;
		background: none;
		border: none;

		&--cart {
			gap: 0.5rem;
			padding: 0.2rem 1rem;
			background: $red;
			color: #fff;
			border-radius: 0.5rem;
			font-size: 1rem;
			font-weight: 600;
		}
	}

	&__ico {
		display: block;
		width: 2rem;
		height: auto;

		&--small {
			width: 1.5rem;
		}
	}
}
</style>
