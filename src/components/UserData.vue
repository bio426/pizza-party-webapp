<template>
	<div class="Data">
		<h4 class="Data__title">
			Usuario:
			<span class="Data__username">nombre de usuario</span>
		</h4>
		<div class="Data__container">
			<Field name="Nombre" />
			<Field name="Apellidos" />
			<Field name="Cumpleaños" />
			<Field name="Genero" />
			<Field name="Tipo de documento" />
			<Field name="Documento" />
			<Field name="Telefono" />
		</div>
		<button class="Data__button">Guardar</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useStore } from "vuex"
import { getAuth } from "firebase/auth"

import Field from "./Field.vue"

export default defineComponent({
	name: "UserData",
	components: {
		Field,
	},
	setup() {
		const store = useStore()
		const auth = getAuth()

		return {
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Data {
	&__title {
		text-align: center;
		font-size: 1.4rem;
	}

	&__username {
		color: $green;
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
