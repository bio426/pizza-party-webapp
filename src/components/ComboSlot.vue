<template>
	<button class="Slot">
		<img
			class="Slot__image"
			src="../assets/images/logoFull.webp"
			:class="[!content.selected ? 'Slot__image--noSelected' : '']"
		/>
		<span class="Slot__content"
			>Slot {{ type }}
			{{ content.selected ? content.name : "no selected" }}</span
		>
		<button class="Slot__button">
			<img
				class="Slot__ico"
				src="../assets/icons/close.svg"
				v-if="content.selected"
			/>
		</button>
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
	display: flex;
	justify-content: space-between;
	align-items: center;

	&__image {
		display: block;
		width: 2rem;
		height: auto;

		&--noSelected {
			filter: grayscale(100%);
		}
	}

	&__button {
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 1rem;
		height: auto;
		background: none;
		border: none;
	}

	&__ico {
		display: block;
		width: 1rem;
		height: auto;
	}
}
</style>
