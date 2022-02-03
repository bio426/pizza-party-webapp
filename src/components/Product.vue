<template>
	<div class="FProduct">
		<img
			class="FProduct__image"
			:class="{ 'FProduct__image--gray': !producExist }"
			:src="product.image"
			alt="imagen de producto"
		/>
		<div class="FProduct__main">
			<div class="FProduct__loading" v-if="!producExist">
				Cargando producto...
			</div>
			<div v-else>
				<span class="FProduct__name">{{ product.name }}</span>
				<p class="FProduct__description">
					{{ product.description }}
				</p>
				<div
					class="FProduct__row"
					:class="{ 'FProduct__row--reverse': !haveSelect }"
				>
					<select
						class="FProduct__select"
						v-if="haveSelect"
						v-model="extraCheese"
					>
						<option class="FProduct__option" value="" disabled>
							Selecciona un tamaño
						</option>
						<option class="FProduct__option" :value="false">
							{{ product.name }}
						</option>
						<option class="FProduct__option" :value="true">
							{{ product.name }} con extraqueso
						</option>
					</select>
					<span class="FProduct__price">S/ {{ productPrice.toFixed(2) }}</span>
				</div>
				<button
					class="FProduct__button"
					@click="$emit('buildCombo')"
					v-if="isCombo"
				>
					<img class="FProduct__ico" src="../assets/icons/cart.svg" />
					<span>Escoger pizzas</span>
					<img class="FProduct__ico" src="../assets/icons/plus.svg" />
				</button>
				<button class="FProduct__button" @click="selectProduct" v-else>
					<img class="FProduct__ico" src="../assets/icons/cart.svg" />
					<span>Añadir</span>
					<img class="FProduct__ico" src="../assets/icons/plus.svg" />
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
let productPrice = computed(() =>
	extraCheese.value ? props.product.price + 2 : props.product.price
)

function selectProduct() {
	let item: ICartItem = {
		id: props.product.id,
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

<style lang="scss">
.FProduct {
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

		&--gray {
			filter: grayscale(100%) blur(5px);
		}
	}

	&__loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10rem;
		color: gray;
		font-size: 1.5rem;
		font-weight: 600;
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
