<template>
	<button class="CItem">
		<img
			class="CItem__image CItem__image--gray"
			src="../../assets/images/americana.webp"
			v-if="!content.selected"
		/>
		<img
			class="CItem__image"
			:src="content.image"
			:class="[!content.selected ? 'CItem__image--gray' : '']"
			v-else
		/>
		<span class="CItem__content"
			>{{ formatedType }}
			{{ content.selected ? content.name : "por seleccionar" }}</span
		>
		<button class="CItem__button">
			<img
				class="CItem__ico"
				src="../../assets/icons/cross.svg"
				v-if="content.selected"
			/>
		</button>
	</button>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue"

import { ComboItem } from "../../interfaces/combo"

type productGroup = "drink" | "pizza"
const props = defineProps({
	type: {
		type: String as PropType<productGroup>,
		required: true,
	},
	content: {
		type: Object as PropType<ComboItem>,
		required: true,
	},
})

let formatedType = computed(() => {
	if (props.content.selected) {
		return ""
	} else {
		if (props.type == "drink") {
			return "Bebida"
		} else {
			return "Pizza"
		}
	}
})
</script>

<style lang="scss">
.CItem {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border: 1px solid black;
	outline: none;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 600;

	&:active {
		background: darken($color: #fff, $amount: 10%);
	}

	&__image {
		display: block;
		width: 3rem;
		height: auto;
		max-height: 2rem;

		&--gray {
			filter: grayscale(100%);
		}
	}

	&__content {
		font-size: 0.9rem;
		margin-left: 0.5rem;

		@media (min-width: 768px) {
			font-size: 1rem;
			margin-left: none;
		}
	}

	&__button {
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 1rem;
		height: auto;
		margin-right: 1rem;
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
