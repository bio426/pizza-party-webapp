<template>
	<button class="Selectable">
		<img class="Selectable__image" src="../assets/images/logoFull.webp" />
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
	justify-content: space-between;
	align-items: center;
	background: $green;

	&__image {
		display: block;
		width: 2rem;
		height: auto;
	}

	&__name{
		color: #fff;
		font-size: 1rem;
		font-weight: 600;
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
