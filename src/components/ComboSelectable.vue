<template>
	<button class="Selectable">
		<img src="" />
		<span>{{ product.name }}</span>
		<img src="" />
	</button>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "ComboSelectable",
	props: {
		product: {
			type: Object,
			required: true,
		},
	},
	setup(props, ctx) {},
})
</script>

<style lang="scss">
.Selectable {
}
</style>
