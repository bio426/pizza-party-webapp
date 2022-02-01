<template>
	<div class="Product">
		<img
			class="Product__image"
			:src="product.image || fallbackImage"
			:class="[loading ? 'Product__image--loading' : '']"
		/>
		<div class="Product__loading" v-if="loading">Cargando producto...</div>
		<div class="Product__main" v-else>
			<h4 class="Product__name">{{ product.name }}</h4>
			<p class="Product__description">
				{{ product.description || "Sin descripción" }}
			</p>
			<div class="Product__container">
				<label class="Product__label" v-if="extraCheese">
					<input
						class="Product__checkbox"
						type="checkbox"
						v-model="withCheese"
					/>
					<!-- <span class="Product__check"></span> -->
					Extra queso
				</label>
				<span class="Product__price">S/ {{ endPrice.toFixed(2) }}</span>
			</div>
			<button
				class="Product__button"
				@click="sendToCart"
				v-if="!product.includes"
			>
				<img class="Product__ico" src="../assets/icons/cart.svg" />
				Añadir
				<img class="Product__ico" src="../assets/icons/plus.svg" />
			</button>
			<button class="Product__button" @click="$emit('buildCombo')" v-else>
				<img class="Product__ico" src="../assets/icons/cart.svg" />
				Escoger pizzas
				<img class="Product__ico" src="../assets/icons/plus.svg" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import useNotification from "../hooks/useNotification"
import { IProduct } from "../interfaces/products"
import { ICartItem } from "../interfaces/cart"

const props = defineProps({
	product: {
		type: Object as PropType<IProduct>,
		default: () => ({
			id: "noId",
			name: "noName",
			code: "noCode",
			price: 0,
			tag: "noTag",
		}),
	},
	extraCheese: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
})

defineEmits(["buildCombo"])

const store = useStore(key)

const { notyf } = useNotification()

let withCheese = ref(false)
const cheesePrice = 2
let endPrice = computed(() => {
	if (withCheese.value) {
		return props.product.price + cheesePrice
	} else {
		return props.product.price
	}
})

function sendToCart() {
	let item: ICartItem = {
		id: props.product.id,
		name: props.product.name,
		code: props.product.code,
		price: props.product.price,
		tag: props.product.tag,
		quantity: 1,
	}
	if (withCheese.value) {
		item.contains = { cheese: true }
		item.price = item.price + cheesePrice
	}
	store.commit({ type: "addToCart", product: item })
	let alert = `x1 ${props.product.name} ${
		withCheese.value ? "extra queso" : ""
	} agregado`
	notyf.success(alert)
}

let fallbackImage = new URL("../assets/images/americana.webp", import.meta.url)
	.href
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
		height: auto;
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
		min-height: 2rem;
		margin-top: 1rem;
		font-size: 0.9rem;
	}

	&__container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	&__label {
		position: relative;
		margin: 0.5rem 0;
		font-size: 1rem;
	}

	&__checkbox {
		&:checked {
			~ .Product__check {
				background: blue;
			}
		}
	}

	&__check {
		position: absolute;
		width: 1rem;
		height: 1rem;
		background: red;
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
