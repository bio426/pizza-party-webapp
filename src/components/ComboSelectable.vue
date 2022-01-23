<template>
	<button class="Selectable">
		<img class="Selectable__image" :src="product.image" />
		<span class="Selectable__name">{{ product.name }}</span>
		<button class="Selectable__button">
			<img class="Selectable__ico" src="../assets/icons/plus-black.svg" />
		</button>
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
@import "../assets/styles/variables";

.Selectable {
	display: flex;
	// flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border: 1px solid black;
	outline: none;
	cursor: pointer;

	&:active {
		background: darken($color: #fff, $amount: 10);
	}

	&__image {
		display: block;
		width: 3rem;
		height: auto;
		max-height: 2rem;
		object-fit: cover;
	}

	&__name {
		color: #000;
		font-size: .9rem;

		@media (min-width: 768px) {
			font-size: 1rem;
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
		width: .8rem;
		height: auto;

		@media (min-width: 768px) {
			width: 1rem;
		}
	}
}
</style>
