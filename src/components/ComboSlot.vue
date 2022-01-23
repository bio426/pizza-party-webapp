<template>
	<button class="Slot">
		<img
			class="Slot__image Slot__image--noSelected"
			src="../assets/images/americana.webp"
			v-if="!content.selected"
		/>
		<img
			class="Slot__image"
			:src="content.image"
			:class="[!content.selected ? 'Slot__image--noSelected' : '']"
			v-else
		/>
		<span class="Slot__content"
			>{{ formatedType }}
			{{ content.selected ? content.name : "por seleccionar" }}</span
		>
		<button class="Slot__button">
			<img
				class="Slot__ico"
				src="../assets/icons/cross.svg"
				v-if="content.selected"
			/>
		</button>
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue"

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
	setup(props, ctx) {
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

		return {
			formatedType,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Slot {
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
		background: darken($color: #fff, $amount: 10);
	}

	&__image {
		display: block;
		width: 3rem;
		height: auto;
		max-height: 2rem;

		&--noSelected {
			filter: grayscale(100%);
		}
	}

	&__content{
		font-size: .9rem;
		margin-left: .5rem;

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
