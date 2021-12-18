<template>
	<button class="Selectable">
		<img class="Selectable__image" src="../assets/images/americana.webp" />
		<span class="Selectable__name">{{ product.name }}</span>
		<button class="Selectable__button">
			<img class="Selectable__ico" src="../assets/icons/plus.svg" />
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

	&:hover{
		background: lighten($color: $green, $amount: 50%);
	}

	&__image {
		display: block;
		width: 3rem;
		height: auto;
		object-fit: cover;
	}

	&__name{
		color: #000;
		font-size: 1rem;
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
