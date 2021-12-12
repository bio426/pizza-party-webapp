<template>
	<div class="Order">
		<span class="Order__label">Hora del pedido</span>
		<span class="Order__info">{{ formatedTime }}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue"

import { IOrderResponse } from "../interfaces/admin"

export default defineComponent({
	name: "Order",
	props: {
		order: {
			type: Object as PropType<IOrderResponse>,
			required: true,
		},
	},
	setup(props, ctx) {
		let formatedTime = computed(() => {
			let time = props.order.createdAt.toDate()
			let hours: string | number = time.getHours()
			let minutes: string | number = time.getMinutes()
			if (hours < 10) {
				hours = "0" + hours.toString()
			}
			if (minutes < 10) {
				minutes = "0" + minutes.toString()
			}
			return `${hours}:${minutes}`
		})

		return { formatedTime }
	},
})
</script>

<style lang="scss">
.Order {
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);
	cursor: pointer;

	&__label {
		display: block;
		font-size: 0.9rem;
	}

	&__info {
		display: block;
		margin: .5rem 0;
	}
}
</style>
