<template>
	<ModalBase title="Arma tu combo" @close-modal="$emit('closeSelector')">
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
				<p>Haz click para selecSitemonar o quitar elementos para tu combo.</p>
			</div>
			<hr class="CSelector__spacer" />
			<div class="CSelector__wrapper CSelector__wrapper--items">
				<div class="CSelector__items">
					<div
						class="SItem"
						v-for="(pizza, i) in pizzaItems"
						:key="pizza.id"
						@click="clearItem(i, 'pizza')"
					>
						<img
							class="SItem__image SItem__image--gray"
							src="../../assets/images/americana.webp"
							v-if="!pizza.selected"
						/>
						<img class="SItem__image" :src="pizza.image" v-else />
						<span class="SItem__name">{{
							pizza.selected ? pizza.name : "Pizza por seleccionar"
						}}</span>
						<img
							class="SItem__ico"
							src="../../assets/icons/cross.svg"
							v-if="pizza.selected"
						/>
					</div>
					<div
						class="SItem"
						v-for="(drink, i) in drinkItems"
						:key="drink.id"
						@click="clearItem(i, 'drink')"
					>
						<img
							class="SItem__image SItem__image--gray"
							src="../../assets/images/americana.webp"
							v-if="!drink.selected"
						/>
						<img class="SItem__image" :src="drink.image" v-else />
						<span class="SItem__name">{{
							drink.selected ? drink.name : "Bebida por seleccionar"
						}}</span>
						<img
							class="SItem__ico"
							src="../../assets/icons/cross.svg"
							v-if="drink.selected"
						/>
					</div>
				</div>
			</div>
			<hr class="CSelector__spacer" />
			<div class="CSelector__wrapper">
				<span class="CSelector__category">Pizzas</span>
				<div class="CSelector__options">
					<div
						class="SOption"
						v-for="pizza in pizzaOptions"
						:key="pizza.id"
						@click="selectProduct(pizza)"
					>
						<img class="SOption__image" :src="pizza.image" />
						<span class="SOption__name">{{ pizza.name }}</span>
						<img class="SOption__ico" src="../../assets/icons/plus-black.svg" />
					</div>
				</div>
				<span class="CSelector__category">Bebidas</span>
				<div class="CSelector__options">
					<div
						class="SOption"
						v-for="drink in drinkOptions"
						:key="drink.id"
						@click="selectProduct(drink)"
					>
						<img class="SOption__image" :src="drink.image" />
						<span class="SOption__name">{{ drink.name }}</span>
						<img class="SOption__ico" src="../../assets/icons/plus-black.svg" />
					</div>
				</div>
			</div>

			<button class="CSelector__button" @click="addCombo">
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

	&__wrapper {
		max-height: 30vh;
		margin-bottom: 1rem;
		overflow-y: scroll;

		&--items {
			max-height: 10rem;
		}

		@media (min-width: 768px) {
			max-height: 40vh;
			overflow-y: auto;
		}
	}

	&__items {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 1rem;

		@media (min-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__category {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	&__options {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 1rem;

		@media (min-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__button {
		display: block;
		width: 100%;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border: 1px solid $green;
		border-radius: 0.5rem;
		outline: none;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
	}

	&__ico {
		display: block;
		width: 1rem;
	}
}

.SItem {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border: 1px solid black;
	cursor: pointer;

	&__image {
		display: block;
		width: 3rem;
		height: auto;
		max-height: 2rem;
		object-fit: cover;

		&--gray {
			filter: grayscale(100%);
		}
	}

	&__name {
		display: block;
		flex: 1;
		color: #000;
		font-size: 0.9rem;
		font-weight: 600;
		text-align: center;

		@media (min-width: 768px) {
			font-size: 1rem;
		}
	}

	&__ico {
		display: block;
		width: 0.8rem;
		height: auto;
		margin-right: 0.5rem;

		@media (min-width: 768px) {
			width: 1rem;
			margin-right: 1rem;
		}
	}
}

.SOption {
	display: flex;
	// flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border: 1px solid black;
	cursor: pointer;

	&:active {
		background: darken($color: #fff, $amount: 10%);
	}

	&__image {
		display: block;
		width: 3rem;
		height: auto;
		max-height: 2rem;
		object-fit: cover;
	}

	&__name {
		display: block;
		color: #000;
		font-size: 0.9rem;
		text-align: center;

		@media (min-width: 768px) {
			font-size: 1rem;
		}
	}

	&__ico {
		display: block;
		width: 0.8rem;
		height: auto;
		margin-right: 0.5rem;

		@media (min-width: 768px) {
			width: 1rem;
			margin-right: 1rem;
		}
	}
}
</style>
