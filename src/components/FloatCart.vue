<template>
	<div class="fixed bottom-0 w-full py-2 bg-white">
		<button
			class="flex justify-around items-center w-9/10 mx-auto p-2 bg-red-500 text-white rounded-lg font-bold"
			@click="toogleCart"
		>
			<span
				class="flex justify-center items-center w-6 h-6 mr-8 bg-white text-red-500 rounded-full"
				>{{ cartLength }}</span
			>
			Ver carrito
			<span class="font-bold">S/ {{ cartPrice.toFixed(2) }}</span>
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

<style></style>
