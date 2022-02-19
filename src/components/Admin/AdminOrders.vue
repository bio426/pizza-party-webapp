<template>
	<table class="w-full border-collapse">
		<thead>
			<tr>
				<th class="p-2 bg-black text-white">Time</th>
				<th class="p-2 bg-black text-white">Phone</th>
				<th class="p-2 bg-black text-white">Select</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(order, i) in orders" @click="selectOrder(i)">
				<td class="p-2 border border-black">
					{{ order.createdAt.toTimeString().substring(0, 5) }}
				</td>
				<td class="p-2 border border-black">{{ order.user.phone }}</td>
				<td class="p-2 border border-black text-center">
					<button
						class="p-1 bg-green-500 text-white rounded"
						@click="$emit('watchOrder', i)"
					>
						<img class="block w-4" src="../../assets/icons/eye.svg" />
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { IOrder } from "../../interfaces"

const props = defineProps({
	orders: {
		type: Array as PropType<IOrder[]>,
		required: true,
	},
})
const emits = defineEmits(["watchOrder"])

function selectOrder(index: number) {}
</script>

<style></style>
