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
				<span class="Combo__name"> {{ comboData.name }}</span>
				<p class="Combo__description">
					{{ comboData.description }}
				</p>
				<div class="Combo__alert">
					<img class="Combo__alertIco" src="../assets/icons/info.svg" />
					<p>Haz click para seleccionar o quitar elementos para tu combo.</p>
				</div>
				<hr class="Combo__spacer" />
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
				<span class="Combo__category">Pizzas</span>
				<div class="Combo__selectables">
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
				</div>
				<span class="Combo__category">Bebidas</span>
				<div class="Combo__selectables">
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
import { defineComponent, ref, onBeforeUnmount } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import useComboModal from "../hooks/useComboModal"
import useNotification from "../hooks/useNotification"
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
		const { closeComboModal, comboData } = useComboModal()
		const { notyf } = useNotification()

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
				image: "",
			})
		}
		for (let i = 0; i < drinkCount; i++) {
			drinkSlots.value.push({
				id: null,
				name: null,
				selected: false,
				image: "",
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
							image: product.image as string,
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
							image: product.image,
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

		function allSlotsSelected() {
			for (let i = 0; i < pizzaSlots.value.length; i++) {
				if (!pizzaSlots.value[i].selected) {
					return false
				}
			}
			for (let i = 0; i < drinkSlots.value.length; i++) {
				if (!drinkSlots.value[i].selected) {
					return false
				}
			}
			return true
		}

		function sendToCart() {
			if (!allSlotsSelected()) {
				notyf.error("Faltan seleccionar elementos")
				return
			}
			let item: ICartItem = {
				id: comboData.id,
				name: comboData.name,
				code: comboData.code,
				price: comboData.price,
				tag: comboData.tag,
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
			notyf.success(`x1 Combo ${comboData.name} agregado`)
		}

		document.addEventListener("keydown", closeWithKey)

		function closeWithKey(e: KeyboardEvent) {
			if (e.key == "Escape") {
				closeComboModal()
			}
		}

		onBeforeUnmount(() => {
			document.removeEventListener("keydown", closeWithKey)
		})

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
			comboData,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Combo {
	@include modal;

	&__body {
		margin-top: 1rem;
	}

	&__name {
		font-size: 1.2rem;
	}

	&__description {
		margin: 0.5rem 0;
	}

	&__spacer {
		margin: 1rem 0;
	}

	&__slots {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	&__category {
		display: block;
		margin: 0.5rem 1rem;
		font-weight: 600;
	}

	&__selectables {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	&__button {
		margin-top: 1rem;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
