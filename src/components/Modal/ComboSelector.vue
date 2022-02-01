<template>
	<BaseModal title="Arma tu combo" @close-modal="$emit('closeSelector')">
		<div class="CSelector">
			<span class="CSelector__name">{{ combo.name }}</span>
			<p class="CSelector__description">
				{{ combo.description }}
			</p>
			<div class="CSelector__alert">
				<img
					class="CSelector__ico"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p>Haz click para seleccionar o quitar elementos para tu combo.</p>
			</div>
			<hr class="CSelector__spacer" />
			<div class="CSelector__items">
				<ComboItem
					type="pizza"
					v-for="(pizza, i) in pizzaItems"
					:content="pizza"
					:key="i"
					@click="clearItem(i, 'pizza')"
				/>
				<ComboItem
					type="drink"
					v-for="(drink, i) in drinkItems"
					:content="drink"
					:key="i"
					@click="clearItem(i, 'drink')"
				/>
			</div>
			<hr class="CSelector__spacer" />
			<span class="CSelector__category">Pizzas</span>
			<div class="CSelector__options">
				<ComboOption
					v-for="pizza in pizzaOptions"
					:product="pizza"
					:key="pizza.id"
					@click="selectProduct(pizza)"
				/>
			</div>
			<span class="CSelector__category">Bebidas</span>
			<div class="CSelector__options">
				<ComboOption
					v-for="drink in drinkOptions"
					:product="drink"
					:key="drink.id"
					@click="selectProduct(drink)"
				/>
			</div>
			<button class="CSelector__button" @click="addCombo">
				Agregar al carrito
			</button>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue"

import BaseModal from "./BaseModal.vue"
import ComboOption from "./ComboOption.vue"
import ComboItem from "./ComboItem.vue"

import { useStore } from "../../store"
import { IProduct, IComboItem, ICartItem } from "../../interfaces"
import useNotification from "../../hooks/useNotification"

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
const { notyf } = useNotification()

// Initializing blank item slots
let pizzaItems = ref<IComboItem[]>([])
let drinkItems = ref<IComboItem[]>([])
let pizzaCount = props.combo.includes?.pizza || 0
let drinkCount = props.combo.includes?.drink || 0
let blankItem = {
	id: "",
	name: "",
	image: "",
	selected: false,
}
for (let i = 0; i < pizzaCount; i++) {
	pizzaItems.value.push(blankItem)
}
for (let i = 0; i < drinkCount; i++) {
	drinkItems.value.push(blankItem)
}

function selectProduct(product: IProduct) {
	if (product.tag == "classic" || product.tag == "premium") {
		for (let i = 0; i < pizzaItems.value.length; i++) {
			if (!pizzaItems.value[i].selected) {
				pizzaItems.value[i] = {
					id: product.id,
					name: product.name,
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
		notyf.error("Faltan items por seleccionar")
		return 0
	}
	let cartItem: ICartItem = {
		id: props.combo.id,
		name: props.combo.name,
		code: props.combo.code,
		price: props.combo.price,
		tag: props.combo.tag,
		quantity: 1,
	}
	let pizzas: string[] = []
	pizzaItems.value.forEach((item) => {
		if (item.selected) {
			if (!item.name) return 0
			pizzas.push(item.name)
		}
	})
	let drinks: string[] = []
	drinkItems.value.forEach((item) => {
		if (item.selected) {
			if (!item.name) return 0
			drinks.push(item.name)
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

<style lang="scss">
.CSelector {
	&__name {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 1.2rem;
	}

	&__description {
		margin-bottom: 1rem;
	}

	&__alert {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border-radius: 0.5rem;
		font-size: 0.9rem;
	}

	&__spacer {
		margin: 1rem 0;
	}

	&__items {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	&__category {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	&__options {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	&__button {
		display: block;
		width: 100%;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border: 1px solid $green;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
	}

	&__ico {
		display: block;
		width: 1rem;
	}
}
</style>
