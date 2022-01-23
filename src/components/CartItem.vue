<template>
	<div class="Item">
		<div class="Item__main">
			<img class="Item__image" src="../assets/images/americana.webp" />
			<div class="Item__container Item__container--info">
				<span class="Item__name"> {{ item.quantity }} x {{ item.name }} </span>
				<span class="Item__price">S/ {{ item.price.toFixed(2) }}</span>
			</div>
			<div class="Item__container">
				<div class="Item__container Item__container--actions">
					<button class="Item__button" @click="removeItem(index)">
						<img class="Item__ico" src="../assets/icons/trash.svg" />
					</button>
					<button
						class="Item__button"
						@click="showDescription = !showDescription"
						v-if="item.contains"
					>
						<img
							class="Item__ico"
							:class="{ 'Item__ico--rotated': showDescription }"
							src="../assets/icons/arrow-down.svg"
						/>
					</button>
				</div>
				<div class="Item__container Item__container--quantity">
					<button
						class="Item__button Item__button--quantity"
						@click="changeQuantity('-')"
					>
						<img
							class="Item__ico Item__ico--quantity"
							src="../assets/icons/minus.svg"
						/>
					</button>
					<span class="Item__quantity">{{ item.quantity }}</span>
					<button
						class="Item__button Item__button--quantity"
						@click="changeQuantity('+')"
					>
						<img
							class="Item__ico Item__ico--quantity"
							src="../assets/icons/plus-black.svg"
						/>
					</button>
				</div>
			</div>
		</div>
		<div class="Item__description" v-if="showDescription">
			<ul>
				<li v-if="item.contains?.cheese">
					<span v-if="item.contains.pizza"
						>x{{ item.contains.pizza?.length }}</span
					>
					Extra queso
				</li>
				<li v-for="(pizza, i) in item.contains?.pizza" :key="i">
					{{ pizza }}
				</li>
				<li v-for="(drink, i) in item.contains?.drink" :key="i">
					{{ drink }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import { ICartItem } from "../interfaces/cart"

export default defineComponent({
	name: "CartItem",
	props: {
		item: {
			type: Object as PropType<ICartItem>,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	},
	setup(props, ctx) {
		const store = useStore(key)

		function removeItem(index: number) {
			store.commit({
				type: "removeFromCart",
				index,
			})
		}

		type operation = "+" | "-"
		function changeQuantity(operation: operation) {
			store.commit({
				type: "changeItemQuantity",
				operation,
				index: props.index,
			})
		}

		let showDescription = ref(false)

		return {
			removeItem,
			changeQuantity,
			showDescription,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Item {
	padding: 1rem 0;
	border-top: 1px solid #000;

	&:last-child {
		border-bottom: 1px solid #000;
	}

	&__main {
		display: flex;
		gap: 1rem;
	}

	&__image {
		display: block;
		width: 4rem;
		height: auto;
		border-radius: 0.5rem;
	}

	&__container {
		&--info {
			flex: 1;
		}
		&--actions {
			display: flex;
			justify-content: space-between;
		}
		&--quantity {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin-top: 0.5rem;
		}
	}

	&__name {
		display: block;
	}

	&__price {
		display: block;
		margin-top: 0.5rem;
		font-weight: 600;
	}

	&__button {
		background: none;
		border: none;
		cursor: pointer;

		&--quantity {
			padding: 0.2rem;
			border: 1px solid #000;
			border-radius: 0.5rem;
		}
	}

	&__description {
		// border: 1px solid red;
		padding: 1rem;
		padding-bottom: 0;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;

		&--quantity {
			width: 0.9rem;
		}

		&--rotated {
			transform: rotate(180deg);
		}
	}
}
</style>
