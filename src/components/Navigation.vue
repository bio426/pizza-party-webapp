<template>
	<div class="Navigation" :class="[cart ? 'Navigation--fixed' : '']">
		<div class="Navigation__container">
			<a
				class="Navigation__link"
				href="#combosSection"
				:class="[activeLink == 1 ? 'Navigation__link--active' : '']"
				@click="activeLink = 1"
			>
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Combos</a
			>
			<a
				class="Navigation__link"
				href="#classicsSection"
				:class="[activeLink == 2 ? 'Navigation__link--active' : '']"
				@click="activeLink = 2"
			>
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Clasicas</a
			>
			<a
				class="Navigation__link"
				href="#premiumsSection"
				:class="[activeLink == 3 ? 'Navigation__link--active' : '']"
				@click="activeLink = 3"
			>
				<img
					class="Navigation__ico"
					src="../assets/icons/pizza.svg"
				/>Premium</a
			>
			<a
				class="Navigation__link"
				href="#drinksSection"
				:class="[activeLink == 4 ? 'Navigation__link--active' : '']"
				@click="activeLink = 4"
			>
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Bebidas</a
			>
			<a
				class="Navigation__link"
				href="#extrasSection"
				:class="[activeLink == 5 ? 'Navigation__link--active' : '']"
				@click="activeLink = 5"
			>
				<img class="Navigation__ico" src="../assets/icons/pizza.svg" />
				Extras</a
			>
			<div
				class="Navigation__container Navigation__container--cart"
				v-if="cart"
			>
				<button class="Navigation__cart" ref="cartButton" @click="toogleCart">
					<img class="Navigation__ico" src="../assets/icons/cart.svg" />
					S/ {{ cartPrice.toFixed(2) }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import useCart from "../composables/useCart"

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

		let activeLink = ref(1)

		let cartButton = ref<HTMLButtonElement>()
		function onCartAdd() {
			cartButton.value?.classList.add("animate__animated", "animate__headShake")
			cartButton.value?.addEventListener("animationend", (e) => {
				e.stopPropagation()
				cartButton.value?.classList.remove(
					"animate__animated",
					"animate__headShake"
				)
			})
		}

		watch(
			() => store.getters.cartPrice,
			(now, prev) => {
				onCartAdd()
			}
		)

		return {
			toogleCart,
			cartPrice: computed<number>(() => store.getters.cartPrice),
			activeLink,
			cartButton,
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

	@media (min-width: 1024px) {
		width: 70%;
		margin: 1rem auto;
		border-radius: 0.5rem;

		&--fixed {
			width: 100%;
		}
	}

	&__container {
		display: flex;
		overflow-x: auto;

		&--cart {
			justify-content: center;
			align-items: center;
			overflow-x: visible;
		}

		@media (min-width: 768px) {
			justify-content: center;
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
		cursor: pointer;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}

.animate__animated {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}
@keyframes headShake {
	0% {
		-webkit-transform: translateX(0);
		transform: translateX(0);
	}

	6.5% {
		-webkit-transform: translateX(-6px) rotateY(-9deg);
		transform: translateX(-6px) rotateY(-9deg);
	}

	18.5% {
		-webkit-transform: translateX(5px) rotateY(7deg);
		transform: translateX(5px) rotateY(7deg);
	}

	31.5% {
		-webkit-transform: translateX(-3px) rotateY(-5deg);
		transform: translateX(-3px) rotateY(-5deg);
	}

	43.5% {
		-webkit-transform: translateX(2px) rotateY(3deg);
		transform: translateX(2px) rotateY(3deg);
	}

	50% {
		-webkit-transform: translateX(0);
		transform: translateX(0);
	}
}
.animate__headShake {
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-name: headShake;
	animation-name: headShake;
}
</style>
