<template>
	<div class="MProduct">
		<img
			class="MProduct__image"
			:src="mainProduct.image"
			alt="imagen de producto"
		/>
		<div class="MProduct__main">
			<span class="MProduct__name">{{ formattedName }}</span>
			<p class="MProduct__description">
				{{ mainProduct.description }}
			</p>
			<div class="MProduct__row">
				<select class="MProduct__select" v-model="activeOption">
					<option class="MProduct__option" value="" disabled>
						Selecciona un producto
					</option>
					<option
						class="MProduct__option"
						v-for="(product, i) in products"
						:value="i"
					>
						{{ product.name }}
					</option>
				</select>
				<span class="MProduct__price"
					>S/ {{ selectedProduct.price.toFixed(2) }}</span
				>
			</div>
			<button class="MProduct__button" @click="selectProduct">
				<img class="MProduct__ico" src="../assets/icons/cart.svg" />
				<span>Añadir</span>
				<img class="MProduct__ico" src="../assets/icons/plus.svg" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue"

import { useStore } from "../store"
import useNotyf from "../composables/useNotyf"
import { ICartItem, IProduct } from "../interfaces"

const props = defineProps({
	products: {
		type: Object as PropType<IProduct[]>,
		required: true,
	},
})
const store = useStore()
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
	store.commit({ type: "addToCart", product: item })
	let toastMsg = `x1 ${selectedProduct.value.name} agregado`
	notyf.success(toastMsg)
}
</script>

<style lang="scss">
.MProduct {
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
	}

	&__main {
		padding: 1rem;
	}

	&__name {
		display: block;
		margin-bottom: 1rem;
		font-size: 1.2rem;
		font-weight: 600;
	}

	&__description {
		min-height: 2rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	&__row {
		display: flex;
		justify-content: space-between;
		align-items: center;

		&--reverse {
			flex-direction: row-reverse;
		}
	}

	&__select {
		display: block;
		width: 50%;
		padding: 0.5rem;
	}

	&__option {
		padding: 1rem;
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
	}

	&__ico {
		display: block;
		width: 1rem;
		height: auto;
	}
}
</style>
