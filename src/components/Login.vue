<template>
	<div class="Login">
		<div class="Login__main">
			<div class="Login__head">
				<span class="Login__title">Ingresar</span>
				<button class="Login__close" @click="close">
					<img class="Login__ico" src="../assets/icons/close.svg" />
				</button>
			</div>
			<div class="Login__container">
				<p class="Login__info">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
					consequatur porro quia voluptates animi fugiat tempore autem placeat
					illum beatae voluptas veniam laboriosam explicabo quod debitis
					praesentium iusto, accusamus aspernatur?
				</p>
				<button class="Login__button" @click="test">View user</button>
				<button class="Login__button" @click="logOut">Log Out</button>
				<div class="Login__container Login__container--fields">
					<Field name="Correo electronico" v-model="email" />
					<Field name="Contraseña" v-model="password" />
				</div>
				<a class="Login__link">Recuperar contraseña</a>
				<button class="Login__button" @click="logIn">Ingresar</button>
				<p class="Login__info">
					Aun sin cuenta?
					<router-link class="Login__link" to="/register"
						>Registrate</router-link
					>
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import {useStore} from "vuex"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

import Field from "./Field.vue"

export default defineComponent({
	name: "Login",
	components: {
		Field,
	},
	setup() {
		const router = useRouter()
		const store = useStore()
		const auth = getAuth()

		let email = ref("")
		let password = ref("")

		function close() {
			router.push("/")
		}

		function test() {
			console.log(auth.currentUser)
		}

		function logIn() {
			signInWithEmailAndPassword(auth, email.value, password.value)
				.then((user) => {
					console.log(user)
					store.commit({
						type: "setUser",
						newUser: {
							name: "admin",
							email: "admin@admin.com"
						}
					})
				})
				.catch((e) => console.log(e))
		}

		function logOut() {
			auth
				.signOut()
				.then(() => {
					console.log("deslogueado")
				})
				.catch((e) => console.log(e))
		}

		return {
			close,
			email,
			password,
			test,
			logOut,
			logIn,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Login {
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
			margin: 1rem 0;
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
