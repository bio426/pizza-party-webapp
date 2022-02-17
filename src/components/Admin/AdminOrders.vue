<template>
	<table class="AOrders">
		<thead>
			<tr>
				<th>Time</th>
				<th>Phone</th>
				<th>Select</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(order, i) in orders" @click="selectOrder(i)">
				<td>{{ order.createdAt.toTimeString().substring(0,5) }}</td>
				<td>{{ order.user.phone }}</td>
				<td style="text-align:center">
					<button @click="$emit('watchOrder',i)">Watch</button>
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

<style lang="scss">
.AOrders {
	width: 100%;
	border-collapse: collapse;

	th {
		padding: 0.5rem;
		background: #000;
		color: #fff;
		border: 1px solid #fff;
	}

	td {
		padding: 0.5rem;
		background: #fff;
		border: 1px solid black;
	}
}
</style>
