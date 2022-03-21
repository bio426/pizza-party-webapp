<template>
	<ModalBase title="Arma tu pizza" @close-modal="$emit('closeCustom')">
		<div>
			<p>Precio: S/{{ customPrice.toFixed(2) }}</p>
			<hr class="my-2" />
			<div class="grid grid-cols-2 gap-4 h-40 overflow-auto">
				<div
					class="p-2 border border-black text-center"
					v-for="(ingredient, i) in selectedIngredients"
					:key="i"
					@click="removeIngredient(i)"
				>
					{{ ingredient.name }}
				</div>
			</div>
			<hr class="my-2" />
			<div class="grid grid-cols-2 gap-4 h-60 overflow-auto">
				<div
					class="p-2 border border-black text-center"
					v-for="ingredient in ingredients"
					@click="addIngredient(ingredient)"
				>
					{{ ingredient.name }} <br />
					<strong>S/{{ ingredient.price.toFixed(2) }}</strong>
				</div>
			</div>
			<hr class="my-2" />
			<button
				class="block w-full p-2 bg-green-500 text-white rounded-lg font-bold"
				@click="addPizza"
			>
				Agregar al carrito
			</button>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

import ModalBase from "./ModalBase.vue"

import useCartStore from "../../composables/useCartStore"
import { ICartItem } from "../../interfaces"

const emits = defineEmits(["closeCustom"])
const { addItem } = useCartStore()

interface pizzaIngredient {
	name: string
	price: number
}

const ingredients: pizzaIngredient[] = [
	{ name: "Aceitunas verdes", price: 1 },
	{ name: "Albahaca con miel de frutas", price: 1 },
	{ name: "Salsa BBQ", price: 1 },
	{ name: "Cabanossi", price: 3 },
	{ name: "Cebolla", price: 1 },
	{ name: "Champiñones salteados", price: 3 },
	{ name: "Chicharrón de chancho", price: 3 },
	{ name: "Chorizo de finas hierbas", price: 4 },
	{ name: "Durazno almibar", price: 2 },
	{ name: "Frankfurt ahumado", price: 3 },
	{ name: "Hamburguesa de carne", price: 4 },
	{ name: "Huevo frito", price: 2 },
	{ name: "Jamón inglés", price: 4 },
	{ name: "Pollo ", price: 3 },
	{ name: "Pepperoni", price: 3 },
	{ name: "Pimiento", price: 1 },
	{ name: "Piña caramelizada", price: 2 },
	{ name: "Salchichón", price: 3 },
	{ name: "Tocino", price: 4 },
	{ name: "Tomate", price: 1 },
	{ name: "Extra queso", price: 2.5 },
]

let customPrice = computed(() => {
	let total = 0
	selectedIngredients.value.forEach((ingredient) => (total += ingredient.price))
	return total
})

let selectedIngredients = ref<pizzaIngredient[]>([
	{ name: "Masa base", price: 15 },
])

function addIngredient(ingredient: pizzaIngredient) {
	if (selectedIngredients.value.includes(ingredient)) return
	selectedIngredients.value.push(ingredient)
}

function removeIngredient(index: number) {
	selectedIngredients.value.splice(index, 1)
}

function addPizza() {
	let contains: string[] = selectedIngredients.value.map(
		(ingredient) => ingredient.name
	)
	let item: ICartItem = {
		id: "custom",
		code: "custom",
		image: "",
		name: "Pizza Custom",
		price: customPrice.value,
		quantity: 1,
		tag: "combo",
		contains,
	}

	addItem(item)
	emits("closeCustom")
}
</script>

<style></style>
