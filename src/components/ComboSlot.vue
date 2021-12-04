<template>
	<button class="Slot">
		<img class="Slot__image" src="" />
		<span class="Slot__content">Slot {{type}} {{ content.selected ? content.name : "name" }}</span>
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { ComboItem } from "../interfaces/combo"

export default defineComponent({
	name: "ComboSlot",
	props: {
		type: {
			type: String,
			required: true,
		},
		content: {
			type: Object as PropType<ComboItem>,
			required: true,
		},
	},
})
</script>

<style lang="scss">
.Slot {
}
</style>
