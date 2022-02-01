<template>
	<button class="COption">
		<img class="COption__image" :src="product.image" />
		<span class="COption__name">{{ product.name || "Option name" }}</span>
		<button class="COption__button">
			<img class="COption__ico" src="../../assets/icons/plus-black.svg" />
		</button>
	</button>
</template>

<script setup lang="ts">
const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
})
</script>

<style lang="scss">
.COption {
	display: flex;
	// flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border: 1px solid black;
	outline: none;
	cursor: pointer;

	&:active {
		background: darken($color: #fff, $amount: 10%);
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
		font-size: 0.9rem;

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
		width: 0.8rem;
		height: auto;

		@media (min-width: 768px) {
			width: 1rem;
		}
	}
}
</style>
