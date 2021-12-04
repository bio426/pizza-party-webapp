<template>
	<div class="Register">
		<div class="Register__main">
			<div class="Register__head">
				<span class="Register__title">Registrate</span>
				<button class="Register__close" @click="close">
					<img class="Register__ico" src="../assets/icons/close.svg" />
				</button>
			</div>
			<div class="Register__container">
				<p class="Register__info">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
					consequatur porro quia voluptates animi fugiat tempore autem placeat
					illum beatae voluptas veniam laboriosam explicabo quod debitis
					praesentium iusto, accusamus aspernatur?
				</p>
				<p class="Register__info">
					Ya tienes cuenta? <a class="Register__link">Inicia sesión</a>
				</p>
				<div class="Register__container Register__container--fields">
					<Field name="Nombre" icon="user" v-model="name" />
					<Field name="Apellidos" icon="user" v-model="lastname" />
					<Field name="Correo" v-model="email" />
					<Field name="Teléfono" icon="phone" v-model="phone" />
					<Field name="Numero de documento" />
					<Field name="Contraseña" v-model="password" />
				</div>
				<button class="Register__button" @click="signUp">Crear cuenta</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection, addDoc } from "firebase/firestore"

import Field from "./Field.vue"

export default defineComponent({
	name: "Register",
	components: {
		Field,
	},
	setup() {
		const router = useRouter()
		const auth = getAuth()
		const db = getFirestore()

		let name = ref("")
		let lastname = ref("")
		let email = ref("")
		let phone = ref("")
		let password = ref("")

		async function signUp() {
			try {
				let credentials = await createUserWithEmailAndPassword(
					auth,
					email.value,
					password.value
				)
				await addDoc(collection(db, "users"), {
					uid: credentials.user.uid,
					name: name.value,
					lastname: lastname.value,
					phone: phone.value,
				})
				console.log("user created", credentials)
			} catch (error) {
				console.log("error creating user", error)
			}
		}

		function close() {
			router.push("/")
		}

		return {
			close,
			name,
			lastname,
			email,
			phone,
			password,
			signUp,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Register {
	@include modal;

	&__container {
		position: relative;

		&--title {
			display: flex;
			justify-content: center;
			padding-bottom: 0.5rem;
			border-bottom: 1px solid #000;
		}

		&--fields {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}

	&__info {
		margin: 1rem 0;
		text-align: center;
	}

	&__button {
		display: block;
		width: 100%;
		margin: 1rem 0;
		padding: 0.5rem;
		background: #000;
		color: #fff;
		border: 1px solid black;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}

	&__link {
		text-decoration: underline;
		font-weight: 600;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
