<template>
	<header class="bg-yellow-500">
		<div class="flex justify-between items-center gap-4 w-9/10 mx-auto py-2">
			<router-link to="/">
				<img class="block" src="../assets/images/logoLetras.webp" />
			</router-link>
			<div class="grow flex gap-4" v-if="isLarge">
				<a class="block text-black font-bold" href="/#combosSection">Menu</a>
				<router-link class="block text-black font-bold" to="/admin"
					>Admin</router-link
				>
				<button
					class="block text-black font-bold"
					@click="showModalCarta = true"
				>
					Carta
				</button>
			</div>
			<div class="flex gap-4" v-if="isLarge">
				<a
					class="flex gap-2 py-2 px-4 bg-white text-black rounded-md font-bold"
					href="tel:555-555-5555"
				>
					<img class="block w-6" src="../assets/icons/phone-solid.svg" />
					973-942-055
				</a>
				<button
					class="flex gap-2 py-2 px-4 bg-red-500 text-white rounded-md font-bold"
					@click="toogleCart"
				>
					<img class="block w-6" src="../assets/icons/cart.svg" />
					S/ {{ cartPrice.toFixed(2) }}
				</button>
			</div>
			<div class="flex gap-4" v-else>
				<a href="tel:555-555-5555" class="">
					<img class="block w-8" src="../assets/icons/phone.svg" />
				</a>
				<router-link to="/">
					<img class="block w-8" src="../assets/icons/user.svg" />
				</router-link>
				<button @click="$emit('showSidebar')">
					<img class="block w-8" src="../assets/icons/menu.svg" />
				</button>
			</div>
		</div>
	</header>
	<ModalCarta v-if="showModalCarta" @close-carta="showModalCarta = false" />
</template>

<script setup lang="ts">
import { ref } from "vue"

import ModalCarta from "./Modal/ModalCarta.vue"

import useCartStore from "../composables/useCartStore"
import useLargeScreen from "../composables/useLargeScreen"
import useCart from "../composables/useCart"

const { cartPrice } = useCartStore()
const { isLarge } = useLargeScreen()
const { toogleCart } = useCart()

const emits = defineEmits(["showSidebar"])

let showModalCarta = ref(false)
</script>

<style></style>
