<template>
	<div class="Combo">
		<div class="Combo__main">
			<div class="Combo__head">
				<span class="Combo__title">Arma tu combo</span>
				<button class="Combo__close" @click="closeComboModal">
					<img class="Combo__ico" src="../assets/icons/close.svg" />
				</button>
			</div>
			<div class="Combo__body">
				<span class="Combo__step">
					Elige el sabor de tus pizzas: 3 restantes
				</span>
				<div class="Combo__slots">
					<ComboSlot
						v-for="(content, i) in pizzaSlots"
						:key="i"
						:content="content"
						type="pizza"
						@click="clearSlot(i, 'pizza')"
					/>
					<ComboSlot
						v-for="(content, i) in drinkSlots"
						:key="i"
						:content="content"
						type="drink"
						@click="clearSlot(i, 'drink')"
					/>
				</div>
				<div class="Combo__products">
					<ComboSelectable
						v-for="(classic, i) in classics"
						:key="i"
						:product="classic"
						@click="addToCombo(classic)"
					/>
					<ComboSelectable
						v-for="(premium, i) in premiums"
						:key="i"
						:product="premium"
						@click="addToCombo(premium)"
					/>
					<ComboSelectable
						v-for="(drink, i) in drinks"
						:key="i"
						:product="drink"
						@click="addToCombo(drink)"
					/>
				</div>
				<button class="Combo__button" @click="sendToCart">
					Agregar al carrito
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useStore } from "vuex"
import { Notyf } from "notyf"

import { key } from "../store"
import useComboModal from "../hooks/useComboModal"
import { ComboItem } from "../interfaces/combo"
import { IProduct } from "../interfaces/products"
import { ICartItem } from "../interfaces/cart"

import ComboSlot from "./ComboSlot.vue"
import ComboSelectable from "./ComboSelectable.vue"

export default defineComponent({
	name: "ComboModal",
	components: {
		ComboSlot,
		ComboSelectable,
	},
	setup() {
		const store = useStore(key)
		const notyf = new Notyf()
		const { closeComboModal, comboData } = useComboModal()

		let classics = ref<IProduct[]>([])
		let premiums = ref<IProduct[]>([])
		let drinks = ref<IProduct[]>([])
		store.state.comboSelectables.forEach((product) => {
			switch (product.tag) {
				case "classic":
					classics.value.push(product)
					break
				case "premium":
					premiums.value.push(product)
					break
				case "drink":
					// Por corregir si se filtran solo bebidas pequeñas
					drinks.value.push(product)
					break
			}
		})

		let pizzaSlots = ref<ComboItem[]>([])
		let drinkSlots = ref<ComboItem[]>([])

		let pizzaCount = comboData.includes?.pizza || 0
		let drinkCount = comboData.includes?.drink || 0

		for (let i = 0; i < pizzaCount; i++) {
			pizzaSlots.value.push({
				id: null,
				name: null,
				selected: false,
			})
		}
		for (let i = 0; i < drinkCount; i++) {
			drinkSlots.value.push({
				id: null,
				name: null,
				selected: false,
			})
		}

		function addToCombo(product: IProduct) {
			if (product.tag == "drink") {
				for (let i = 0; i < drinkSlots.value.length; i++) {
					if (!drinkSlots.value[i].selected) {
						drinkSlots.value[i] = {
							id: product.id,
							name: product.name,
							selected: true,
						}
						break
					}
				}
			} else {
				for (let i = 0; i < pizzaSlots.value.length; i++) {
					if (!pizzaSlots.value[i].selected) {
						pizzaSlots.value[i] = {
							id: product.id,
							name: product.name,
							selected: true,
						}
						break
					}
				}
			}
		}

		type ComboGroups = "pizza" | "drink"
		function clearSlot(index: number, group: ComboGroups) {
			if (group == "drink") {
				if (!drinkSlots.value[index].selected) return 0
				drinkSlots.value[index] = {
					id: null,
					name: null,
					selected: false,
				}
			} else if (group == "pizza") {
				if (!pizzaSlots.value[index].selected) return 0
				pizzaSlots.value[index] = {
					id: null,
					name: null,
					selected: false,
				}
			}
		}

		function sendToCart() {
			let item: ICartItem = {
				id: comboData.id,
				name: comboData.name,
				code: comboData.code,
				price: comboData.price,
				quantity: 1,
			}
			let pizzas: string[] = []
			pizzaSlots.value.forEach((item) => {
				if (item.selected) {
					if (!item.name) return 0
					pizzas.push(item.name)
				}
			})
			let drinks: string[] = []
			drinkSlots.value.forEach((item) => {
				if (item.selected) {
					if (!item.name) return 0
					drinks.push(item.name)
				}
			})
			item.contains = {
				pizza: pizzas,
				drink: drinks,
				cheese: true,
			}

			store.commit({ type: "addToCart", product: item })
			closeComboModal()
			notyf.success("Combo agregado")
		}

		return {
			closeComboModal,
			pizzaSlots,
			drinkSlots,
			classics,
			premiums,
			drinks,
			addToCombo,
			clearSlot,
			sendToCart,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Combo {
	@include modal;

	&__head {
		display: flex;
	}

	&__info {
		width: 100%;
	}

	&__name {
		display: block;
		font-weight: 600;
	}

	&__price {
		font-size: 1.2rem;
	}

	&__close {
		display: block;
		background: none;
		border: none;
	}

	&__body {
		margin-top: 1rem;
	}

	&__slots {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	&__products {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 2rem;
		border: 1px solid red;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
