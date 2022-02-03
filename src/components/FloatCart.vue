<template>
	<div class="FloatCart">
		<button class="FloatCart__button" @click="toogleCart">
			<span class="FloatCart__counter">{{ cartLength }}</span>
			Ver carrito
			<span class="FloatCart__price">S/ {{ cartPrice.toFixed(2) }}</span>
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useStore } from "vuex"

import { key } from "../store"

import useCart from "../composables/useCart"

export default defineComponent({
	name: "FloatCart",
	setup() {
		const store = useStore(key)
		const { toogleCart } = useCart()

		return {
			toogleCart,
			cartPrice: computed<number>(() => store.getters.cartPrice),
			cartLength: computed(() => store.state.cart.length),
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.FloatCart {
	position: fixed;
	bottom: 0;
	width: 100%;
	padding: 0.5rem 0;
	background: #fff;

	&__button {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 90%;
		margin: 0 auto;
		padding: 0.5rem;
		background: $red;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}

	&__counter {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 1.6rem;
		height: 1.6rem;
		margin-right: 0.5rem;
		background: #fff;
		color: $red;
		border-radius: 50%;
		font-size: 1rem;
	}

	&__price {
		font-weight: 600;
	}
}
</style>
