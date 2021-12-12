<template>
	<div class="Product">
		<img class="Product__image" src="../assets/images/americana.webp" />
		<div class="Product__main">
			<h4 class="Product__name">{{ showName }}</h4>
			<p class="Product__description">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores nihil
				repellat, dolorum sequi non vel commodi tenetur modi. Aliquam temporibus
				eveniet sunt et ducimus commodi magni cum alias! Ullam, inventore.
			</p>
			<a class="Product__disclaimer">Terminos y condiciones</a>
			<div class="Product__container">
				<select class="Product__select" v-model="selected">
					<option disabled value="">Selecciona un tamaño</option>
					<option v-for="(drink, i) in products" :key="i" :value="i">
						{{ drink.name }}
					</option>
				</select>
				<span class="Product__price">S/ {{ activePrice.toFixed(2) }}</span>
			</div>
			<button class="Product__button" @click="sendToCart">
				<img class="Product__ico" src="../assets/icons/cart.svg" />
				Añadir
				<img class="Product__ico" src="../assets/icons/plus.svg" />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import useNotification from "../hooks/useNotification"
import { IProduct } from "../interfaces/products"
import { ICartItem } from "../interfaces/cart"

export default defineComponent({
	name: "ProductDrink",
	props: {
		products: {
			type: Array as PropType<IProduct[]>,
			required: true,
		},
	},
	setup(props, ctx) {
		const store = useStore(key)

		const { notyf } = useNotification()

		let drinkName = props.products[0].name
		let showName = ref(drinkName.substring(0, drinkName.lastIndexOf(" ")))

		let selected = ref(0)

		let activePrice = computed(() => {
			if (selected.value == -1) {
				return props.products[0].price
			}
			return props.products[selected.value].price
		})

		function sendToCart() {
			let selectedDrink = props.products[selected.value]
			let item: ICartItem = {
				id: selectedDrink.id,
				name: selectedDrink.name,
				code: selectedDrink.code,
				price: selectedDrink.price,
				tag: selectedDrink.tag,
				quantity: 1,
			}
			store.commit({ type: "addToCart", product: item })
			let alert = `x1 ${item.name} agregado`
			notyf.success(alert)
		}

		return {
			showName,
			selected,
			activePrice,
			sendToCart,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Product {
	width: 100%;
	background: #fff;
	border-radius: 1rem;
	overflow: hidden;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);

	&__image {
		display: block;
		width: 100%;
		height: 12rem;
		object-fit: cover;

		&--loading {
			filter: grayscale(100%) blur(5px);
		}
	}

	&__main {
		padding: 1rem;
	}

	&__loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 12rem;
		color: gray;
		font-size: 1rem;
		font-weight: 600;
	}

	&__name {
		font-size: 1.2rem;
		font-weight: 600;
	}

	&__description {
		margin-top: 1rem;
		font-size: 0.9rem;
	}

	&__disclaimer {
		display: block;
		margin: 0.5rem 0;
		text-decoration: underline;
		font-weight: 500;
	}

	&__container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__select {
		display: block;
		width: 50%;
		padding: 0.5rem;
	}

	&__price {
		display: block;
		font-size: 1.2rem;
		font-weight: 600;
	}

	&__button {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		margin-top: 1rem;
		padding: 0.6rem;
		background: $green;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;

		&:active {
			background: darken($color: $green, $amount: 5%);
		}
	}

	&__ico {
		display: block;
		width: 1rem;
		height: auto;
	}
}
</style>
