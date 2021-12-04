<template>
	<div class="user">
		<div class="user__navigation">
			<div class="user__container user__container--nav">
				<div class="user__container user__container--flex">
					<button class="user__button" @click="activeComponent = 'UserOrder'">
						<img class="user__ico" src="../assets/icons/user.svg" />
					</button>
					<button class="user__button" @click="activeComponent = 'UserData'">
						<img class="user__ico" src="../assets/icons/user.svg" />
					</button>
					<button class="user__button" @click="activeComponent = 'UserAddress'">
						<img class="user__ico" src="../assets/icons/user.svg" />
					</button>
				</div>
				<button class="user__button user__button--out" @click="logOut">
					Cerrar Sesion
				</button>
			</div>
		</div>
		<div class="user__container user__container--main">
			<component :is="activeComponent" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { useStore } from "vuex"
import { getAuth } from "firebase/auth"

import { key } from "../store"

import Field from "../components/Field.vue"
import UserOrder from "../components/UserOrder.vue"
import UserData from "../components/UserData.vue"
import UserAddress from "../components/UserAddress.vue"

export default defineComponent({
	name: "user-view",
	components: {
		Field,
		UserOrder,
		UserData,
		UserAddress,
	},
	setup() {
		const store = useStore(key)
		const auth = getAuth()

		let activeComponent = ref("UserData")

		async function logOut() {
			try {
				await auth.signOut()
			} catch (error) {
				console.log(error)
			}
		}

		return {
			activeComponent,
			logOut,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.user {
	@include page;

	&__navigation {
		display: flex;
		background: $green;
		border: 1px solid red;
	}

	&__container {
		width: 90%;
		margin: 0 auto;

		&--nav {
			display: flex;
			justify-content: space-between;
			padding: 1rem 0;
		}

		&--flex {
			display: flex;
			gap: 1rem;
			width: auto;
			margin: 0;
		}

		&--main {
			padding: 1rem 0;
		}
	}

	&__button {
		background: none;
		border: none;

		&--out {
			padding: 0.5rem;
			border: 1px solid #000;
			border-radius: 0.5rem;
			font-size: 1rem;
		}
	}

	&__ico {
		display: block;
		width: 2rem;
		height: auto;
	}
}
</style>
