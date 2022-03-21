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
						@click="changeQuantity(-1)"
					>
						<img class="block w-3" src="../assets/icons/minus.svg" />
					</button>
					<span>{{ item.quantity }}</span>
					<button
						class="p-1 border border-black rounded-md"
						@click="changeQuantity(1)"
					>
						<img class="block w-3" src="../assets/icons/plus-black.svg" />
					</button>
				</div>
			</div>
		</div>
		<div class="block mt-2" v-if="showDescription">
			<ul v-if="item.contains">
				<li v-if="item.contains.includes('extraChese')">Extra queso</li>
				<li v-for="(included, i) in item.contains" :key="i">
					{{ included }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue"

import useCartStore from "../composables/useCartStore"
import { ICartItem } from "../interfaces"

const props = defineProps({
	item: {
		type: Object as PropType<ICartItem>,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
})

const { removeItem, changeItemQuantity } = useCartStore()

// function removeItem(index: number) {
// 	store.commit({
// 		type: "removeFromCart",
// 		index,
// 	})
// }

function changeQuantity(amount: number) {
	changeItemQuantity(props.index, amount)
}

let showDescription = ref(false)
</script>

<style></style>
