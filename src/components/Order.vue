<template>
	<div class="Order">
		{{ order.createdAt.toDate() }}
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "Order",
	props: {
		order: {
			type: Object,
			required: true,
		},
	},
	setup(props, ctx) {
		return {}
	},
})
</script>

<style lang="scss">
.Order {
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);
}
</style>
