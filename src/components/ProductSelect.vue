<template>
	<div class="w-full bg-white rounded-lg overflow-hidden shadow-xl">
		<img
			class="block w-full object-cover"
			:src="mainProduct.image"
			alt="imagen de producto"
		/>
		<div class="p-4">
			<span class="block mb-4 text-lg font-medium">{{ formattedName }}</span>
			<p class="block min-h-[3rem] mb-4 text-sm">
				{{ mainProduct.description }}
			</p>
			<div class="flex justify-between items-center mb-4">
				<select class="block w-3/4 md:w-1/2 p-2" v-model="activeOption">
					<option value="" disabled>Selecciona un producto</option>
					<option v-for="(product, i) in products" :value="i">
						{{ product.name }}
					</option>
				</select>
				<span class="block text-lg font-bold"
					>S/ {{ selectedProduct.price.toFixed(2) }}</span
				>
			</div>
			<button
				class="flex justify-around items-center w-full p-2 bg-red-500 text-white rounded-md font-semibold"
				@click="selectProduct"
			>
				<img class="block w-4" src="../assets/icons/cart.svg" />
				<span>Agregar</span>
				<img class="block w-4" src="../assets/icons/plus.svg" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue"

import useCartStore from "../composables/useCartStore"
import useNotyf from "../composables/useNotyf"
import { ICartItem, IProduct } from "../interfaces"

const props = defineProps({
	products: {
		type: Object as PropType<IProduct[]>,
		required: true,
	},
})
const { addItem } = useCartStore()
const { notyf } = useNotyf()

let mainProduct = props.products[0]

// Remove quantities from name
let formattedName = computed(() => {
	let hasNumbers = /\d/.test(mainProduct.name)
	if (hasNumbers) {
		let parts = mainProduct.name.split(" ")
		let clear = parts.filter((str) => !/\d/.test(str))
		return clear.join(" ")
	} else {
		return mainProduct.name
	}
})

let activeOption = ref(0)
let selectedProduct = computed(() => props.products[activeOption.value])

function selectProduct() {
	let item: ICartItem = {
		id: selectedProduct.value.id,
		image: mainProduct.image,
		name: selectedProduct.value.name,
		code: selectedProduct.value.code,
		price: selectedProduct.value.price,
		tag: selectedProduct.value.tag,
		quantity: 1,
	}
	addItem(item)
	let toastMsg = `x1 ${selectedProduct.value.name} agregado`
	notyf.success(toastMsg)
}
</script>

<style></style>
