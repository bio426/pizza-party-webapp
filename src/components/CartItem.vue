<template>
	<div class="py-4 border-t last:border-b border-black">
		<div class="flex gap-4">
			<img class="block w-16 rounded-lg" :src="item.image" />
			<div class="grow">
				<span class="block mb-2"> {{ item.quantity }} x {{ item.name }} </span>
				<span class="block font-bold">S/ {{ item.price.toFixed(2) }}</span>
			</div>
			<div>
				<div class="flex justify-between mb-2">
					<button @click="removeItem(index)">
						<img class="block w-6" src="../assets/icons/trash.svg" />
					</button>
					<button
						@click="showDescription = !showDescription"
						v-if="item.contains"
					>
						<img
							class="block w-6"
							:class="{ 'rotate-180': showDescription }"
							src="../assets/icons/arrow-down.svg"
						/>
					</button>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="p-1 border border-black rounded-md"
						@click="changeQuantity('-')"
					>
						<img class="block w-3" src="../assets/icons/minus.svg" />
					</button>
					<span>{{ item.quantity }}</span>
					<button
						class="p-1 border border-black rounded-md"
						@click="changeQuantity('+')"
					>
						<img class="block w-3" src="../assets/icons/plus-black.svg" />
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
					{{ pizza.name }}
				</li>
				<li v-for="(drink, i) in item.contains?.drink" :key="i">
					{{ drink.name }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue"
import { useStore } from "vuex"

import { key } from "../store"
import { ICartItem } from "../interfaces"

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

<style></style>
