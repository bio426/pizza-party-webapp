<template>
	<div class="w-full bg-white rounded-lg overflow-hidden shadow-xl">
		<img
			class="block w-full object-cover"
			:class="{ grayscale: !producExist }"
			:src="product.image"
			alt="imagen de producto"
		/>
		<div class="p-4">
			<div
				class="flex justify-center items-center h-40 text-gray-500 text-xl font-bold"
				v-if="!producExist"
			>
				Cargando producto...
			</div>
			<div v-else>
				<span class="block mb-4 text-lg font-medium">{{ product.name }}</span>
				<p class="block min-h-[3rem] mb-4 text-sm">
					{{ product.description }}
				</p>
				<div
					class="flex justify-between items-center mb-4"
					:class="{ 'flex-row-reverse': !haveSelect }"
				>
					<select
						class="block w-3/4 md:w-1/2 p-2"
						v-if="haveSelect"
						v-model="extraCheese"
					>
						<option value="" disabled>Selecciona un tamaño</option>
						<option :value="false">{{ product.name }}</option>
						<option :value="true">{{ product.name }} con extraqueso</option>
					</select>
					<span class="block text-lg font-bold"
						>S/ {{ productPrice.toFixed(2) }}</span
					>
				</div>
				<button
					class="flex justify-around items-center w-full p-2 bg-red-500 text-white rounded-md font-semibold"
					@click="$emit('buildCombo')"
					v-if="isCombo"
				>
					<img class="block w-4" src="../assets/icons/cart.svg" />
					<span>Escoger pizzas</span>
					<img class="block w-4" src="../assets/icons/plus.svg" />
				</button>
				<button
					class="flex justify-around items-center w-full p-2 bg-red-500 text-white rounded-md font-semibold"
					@click="selectProduct"
					v-else
				>
					<img class="block w-4" src="../assets/icons/cart.svg" />
					<span>Agregar</span>
					<img class="block w-4" src="../assets/icons/plus.svg" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue"

import { useStore } from "../store"
import useNotyf from "../composables/useNotyf"
import { ICartItem, IProduct } from "../interfaces"

const props = defineProps({
	product: {
		type: Object as PropType<IProduct>,
		default: () =>
			({
				id: "",
				description: "",
				name: "",
				code: "",
				price: 0,
				image: new URL("../assets/images/americana.webp", import.meta.url).href,
				tag: "",
			} as IProduct),
	},
})
const emits = defineEmits(["buildCombo"])
const store = useStore()
const { notyf } = useNotyf()

let producExist = props.product.id! != ""
let isCombo = props.product.tag == "combo"
let optionalCheese = ["classic", "premium"]
let haveSelect = optionalCheese.includes(props.product.tag)

let extraCheese = ref(false)
const cheesePrice = 2.5
let productPrice = computed(() =>
	extraCheese.value ? props.product.price + cheesePrice : props.product.price
)

function selectProduct() {
	let item: ICartItem = {
		id: props.product.id,
		image: props.product.image,
		name: props.product.name,
		code: props.product.code,
		price: props.product.price,
		tag: props.product.tag,
		quantity: 1,
	}
	if (extraCheese.value) {
		item.contains = { cheese: true }
		item.price = productPrice.value
	}
	store.commit({ type: "addToCart", product: item })
	let toastMsg = `x1 ${props.product.name} ${
		extraCheese.value ? "con extra queso" : ""
	} agregado`
	notyf.success(toastMsg)
}
</script>

<style></style>
