<template>
	<div class="Address">
		<h4 class="Address__title">Mis direcciones</h4>
		<div class="Address__container">
      
    </div>
		<button class="Address__button">Agregar nueva direccion</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "UserAddress",
	setup() {},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Address {
	&__title {
		text-align: center;
		font-size: 1.4rem;
	}

	&__container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin: 2rem 0;
	}

	&__button {
		display: block;
		margin: 0 auto;
		padding: 0.8rem 3rem;
		background: $green;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}
}
</style>
