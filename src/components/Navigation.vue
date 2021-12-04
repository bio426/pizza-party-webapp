<template>
	<div class="Navigation" :class="[cart ? 'Navigation--fixed' : '']">
		<div class="Navigation__container">
			<a
				class="Navigation__link Navigation__link--active"
				href="#combosSection"
			>
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Combos</a
			>
			<a class="Navigation__link" href="#classicsSection">
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Clasicas</a
			>
			<a class="Navigation__link" href="#premiumsSection">
				<img
					class="Navigation__ico"
					src="../assets/icons/pizza.svg"
				/>Premium</a
			>
			<a class="Navigation__link" href="#drinksSection">
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Bebidas</a
			>
			<a class="Navigation__link" href="#extrasSection">
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Extras</a
			>
			<div
				class="Navigation__container Navigation__container--cart"
				v-if="cart"
			>
				<button class="Navigation__cart" @click="toogleCart">
					<img class="Navigation__ico" src="../assets/icons/cart.svg" />
					S/ {{ cartPrice.toFixed(2) }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import useCart from "../hooks/useCart"

export default defineComponent({
	name: "Navigation",
	props: {
		cart: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const store = useStore(key)
		const { toogleCart } = useCart()

		return {
			toogleCart,
			cartPrice: computed<number>(() => store.getters.cartPrice),
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Navigation {
	position: sticky;
	top: 0;
	width: 100%;
	background: #fff;
	box-shadow: 0 0.2rem 0.2rem rgba($color: #000000, $alpha: 0.5);
	z-index: 5;

	&__container {
		display: flex;
		overflow-x: auto;

		&--cart {
			justify-content: center;
			align-items: center;
		}
	}

	&__link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		color: #000;
		font-weight: 600;
		text-decoration: none;

		&--active {
			color: $red;
			border-bottom: 2px solid $green;
		}
	}

	&__cart {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: $red;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
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
	.Navigation {
		&__container {
			justify-content: center;
		}
	}
}

@media (min-width: 1024px) {
	.Navigation {
		width: 70%;
		margin: 1rem auto;
		border-radius: 0.5rem;

		&--fixed {
			width: 100%;
		}
	}
}
</style>
