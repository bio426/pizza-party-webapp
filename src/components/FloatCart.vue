<template>
	<div class="fixed bottom-0 w-full py-2 bg-white">
		<button
			class="flex justify-around items-center w-9/10 mx-auto p-2 bg-red-500 text-white rounded-lg font-bold"
			@click="toogleCart"
		>
			<span
				class="flex justify-center items-center w-6 h-6 mr-8 bg-white text-red-500 rounded-full"
				>{{ cart.length }}</span
			>
			Ver carrito
			<span class="font-bold">S/ {{ cartPrice.toFixed(2) }}</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import useCartStore from "../composables/useCartStore"
import useCart from "../composables/useCart"

const { cartPrice, cart } = useCartStore()
const { toogleCart } = useCart()
</script>

<style></style>
