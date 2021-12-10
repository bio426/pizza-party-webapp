<template>
	<div class="Active">
		{{ order }}
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "AdminActive",
	props: {
		order: {
			type: Object,
			required: true,
		},
	},
	setup() {
		return {}
	},
})
</script>

<style lang="scss">
.Active {
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);
}
</style>
