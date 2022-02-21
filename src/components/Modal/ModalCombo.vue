<template>
	<ModalBase title="Arma tu combo" @close-modal="$emit('closeSelector')">
		<div>
			<span class="block mb-2 text-xl">{{ combo.name }}</span>
			<p class="block mb-4">
				{{ combo.description }}
			</p>
			<div class="flex gap-2 p-2 bg-yellow-500 rounded-lg text-sm">
				<img
					class="block w-4"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p class="text-black">
					Haz click para seleccionar o quitar elementos para tu combo.
				</p>
			</div>
			<hr class="my-4" />
			<div class="h-40 overflow-y-auto">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div
						class="flex justify-between items-center border border-black"
						:class="{ 'cursor-pointer': pizza.selected }"
						v-for="(pizza, i) in pizzaItems"
						:key="pizza.id"
						@click="clearItem(i, 'pizza')"
					>
						<img
							class="block w-12 max-h-8 grayscale"
							src="../../assets/images/americana.webp"
							v-if="!pizza.selected"
						/>
						<img class="block w-12 max-h-8" :src="pizza.image" v-else />
						<span
							class="grow block text-sm md:text-base font-bold text-center"
							>{{ pizza.selected ? pizza.name : "Pizza por seleccionar" }}</span
						>
						<img
							class="block w-3 md:w-4 mr-2 md:mr-4"
							src="../../assets/icons/cross.svg"
							v-if="pizza.selected"
						/>
					</div>
					<div
						class="flex justify-between items-center border border-black"
						:class="{ 'cursor-pointer': drink.selected }"
						v-for="(drink, i) in drinkItems"
						:key="drink.id"
						@click="clearItem(i, 'drink')"
					>
						<img
							class="block w-12 max-h-8 grayscale"
							src="../../assets/images/chicha.webp"
							v-if="!drink.selected"
						/>
						<img class="block w-12 max-h-8" :src="drink.image" v-else />
						<span
							class="grow block text-sm md:text-base font-bold text-center"
							>{{
								drink.selected ? drink.name : "Bebida por seleccionar"
							}}</span
						>
						<img
							class="block w-3 md:w-4 mr-2 md:mr-4"
							src="../../assets/icons/cross.svg"
							v-if="drink.selected"
						/>
					</div>
				</div>
			</div>
			<hr class="my-4" />
			<div class="h-60 mb-4 overflow-y-auto">
				<span class="block mb-2 font-bold">Pizzas</span>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
					<div
						class="flex justify-between items-center border border-black cursor-pointer"
						v-for="pizza in pizzaOptions"
						:key="pizza.id"
						@click="selectProduct(pizza)"
					>
						<img class="block w-12 max-h-8" :src="pizza.image" />
						<span class="block text-sm md:text-base text-center">{{
							pizza.name
						}}</span>
						<img
							class="block w-3 md:w-4 mr-2 md:mr-4"
							src="../../assets/icons/plus-black.svg"
						/>
					</div>
				</div>
				<span class="block mb-2 font-bold">Bebidas</span>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div
						class="flex justify-between items-center border border-black cursor-pointer"
						v-for="drink in drinkOptions"
						:key="drink.id"
						@click="selectProduct(drink)"
					>
						<img class="block w-12 max-h-8" :src="drink.image" />
						<span class="block text-sm md:text-base text-center">{{
							drink.name
						}}</span>
						<img
							class="block w-3 md:w-4 mr-2 md:mr-4"
							src="../../assets/icons/plus-black.svg"
						/>
					</div>
				</div>
			</div>
			<button
				class="block w-full p-2 bg-red-500 text-white rounded-lg font-bold"
				@click="addCombo"
			>
				Agregar al carrito
			</button>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import { ref, PropType, computed } from "vue"

import ModalBase from "./ModalBase.vue"

import { useStore } from "../../store"
import { IProduct, IComboItem, ICartItem } from "../../interfaces"
import useNotyf from "../../composables/useNotyf"

const props = defineProps({
	combo: {
		type: Object as PropType<IProduct>,
		required: true,
	},
	options: {
		type: Object as PropType<IProduct[]>,
		required: true,
	},
})
const emits = defineEmits(["closeSelector"])
const store = useStore()
const { notyf } = useNotyf()

// Initializing blank item slots
let pizzaCount = props.combo.includes?.pizza || 0
let drinkCount = props.combo.includes?.drink || 0
let blankItem = {
	id: "",
	name: "",
	code: "",
	image: "",
	selected: false,
}
let pizzaItems = ref<IComboItem[]>(
	Array.apply(null, Array(pizzaCount)).map(() => blankItem)
)
let drinkItems = ref<IComboItem[]>(
	Array.apply(null, Array(drinkCount)).map(() => blankItem)
)

function selectProduct(product: IProduct) {
	if (product.tag == "classic" || product.tag == "premium") {
		for (let i = 0; i < pizzaItems.value.length; i++) {
			if (!pizzaItems.value[i].selected) {
				pizzaItems.value[i] = {
					id: product.id,
					name: product.name,
					code: product.code,
					image: product.image,
					selected: true,
				}
				break
			}
		}
	}
	if (product.tag == "drink") {
		for (let i = 0; i < drinkItems.value.length; i++) {
			if (!drinkItems.value[i].selected) {
				drinkItems.value[i] = {
					id: product.id,
					name: product.name,
					code: product.code,
					image: product.image,
					selected: true,
				}
				break
			}
		}
	}
}

function clearItem(index: number, itemGroup: string) {
	if (itemGroup == "pizza" && pizzaItems.value[index].selected) {
		pizzaItems.value[index] = blankItem
	}
	if (itemGroup == "drink" && drinkItems.value[index].selected) {
		drinkItems.value[index] = blankItem
	}
}

function isComboFull() {
	let pizzaLack = pizzaItems.value.some((pizza) => !pizza.selected)
	let drinkLack = drinkItems.value.some((drink) => !drink.selected)
	return !(pizzaLack || drinkLack)
}

function addCombo() {
	if (!isComboFull()) {
		notyf.error("Faltan items por selecSitemonar")
		return 0
	}
	let cartItem: ICartItem = {
		id: props.combo.id,
		image: props.combo.image,
		name: props.combo.name,
		code: props.combo.code,
		price: props.combo.price,
		tag: props.combo.tag,
		quantity: 1,
	}
	let pizzas: { name: string; code: string }[] = []
	pizzaItems.value.forEach((item) => {
		if (item.selected) {
			if (!item.name) return 0
			pizzas.push({ name: item.name, code: item.code })
		}
	})
	let drinks: { name: string; code: string }[] = []
	drinkItems.value.forEach((item) => {
		if (item.selected) {
			if (!item.name) return 0
			drinks.push({ name: item.name, code: item.code })
		}
	})
	cartItem.contains = {
		pizza: pizzas,
		drink: drinks,
		cheese: true,
	}

	store.commit({ type: "addToCart", product: cartItem })
	notyf.success(`x1 Combo ${props.combo.name} agregado`)
	emits("closeSelector")
}

// Options to choose
const pizzaOptions = ref<IProduct[]>(
	props.options.filter(
		(product) => product.tag == "classic" || product.tag == "premium"
	)
)
const drinkOptions = ref<IProduct[]>(
	props.options.filter((product) => product.tag == "drink")
)
</script>

<style></style>
