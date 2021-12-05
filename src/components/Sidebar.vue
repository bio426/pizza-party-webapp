<template>
	<div class="Sidebar">
		<transition name="slide">
			<div class="Sidebar__main" v-if="showMain">
				<div class="Sidebar__container Sidebar__container--close">
					<button class="Sidebar__close" @click="$emit('hideSidebar')">
						<img class="Sidebar__ico" src="../assets/icons/close.svg" />
					</button>
				</div>
				<div class="Sidebar__container">
					<img class="Sidebar__logo" src="../assets/images/logoFull.webp" />
					<div class="Sidebar__container">
						<router-link class="Sidebar__link" to="/">Menu</router-link>
						<router-link class="Sidebar__link" to="/">Locales</router-link>
						<router-link class="Sidebar__link" to="/user"
							>Mi cuenta</router-link
						>
					</div>
					<div class="Sidebar__container Sidebar__container--social">
						<a class="Sidebar__link Sidebar__link--social">
							<img class="Sidebar__ico" src="../assets/icons/facebook.svg" />
						</a>
						<a class="Sidebar__link Sidebar__link--social">
							<img class="Sidebar__ico" src="../assets/icons/instagram.svg" />
						</a>
						<a class="Sidebar__link Sidebar__link--social">
							<img class="Sidebar__ico" src="../assets/icons/maps.svg" />
						</a>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue"

export default defineComponent({
	name: "Sidebar",
	setup() {
		let showMain = ref(false)

		onMounted(() => (showMain.value = true))

		return {
			showMain,
		}
	},
})
</script>

<style lang="scss">
.Sidebar {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100vh;
	background: rgba($color: #000000, $alpha: 0.5);
	z-index: 10;

	&__main {
		position: absolute;
		right: 0;
		width: 80%;
		height: 100%;
		padding: 1.5rem;
		background: #fff;
	}

	&__container {
		display: flex;
		flex-direction: column;
		align-items: center;

		&--close {
			flex-direction: row;
			justify-content: flex-end;
		}

		&--social {
			flex-direction: row;
			margin-top: 1rem;
		}
	}

	&__close {
		padding-left: auto;
		background: none;
		border: none;
	}

	&__logo {
		display: block;
		width: 8rem;
		height: auto;
		margin: 2rem 0;
	}

	&__link {
		margin: 0.5rem;
		color: #000;
		font-size: 1.2rem;
		text-decoration: none;

		&--social {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 2.5rem;
			width: 2.5rem;
			background: #000;
			border-radius: 50%;
		}
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}
</style>
