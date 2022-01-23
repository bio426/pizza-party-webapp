<template>
	<footer class="Footer">
		<div class="Footer__main">
			<div class="Footer__social">
				<span class="Footer__text">Siguenos en:</span>
				<div class="Footer__links">
					<a
						class="Footer__link"
						href="https://www.facebook.com/todalapizzaquepuedas"
						target="_blank"
					>
						<img class="Footer__ico" src="../assets/icons/facebook.svg" />
					</a>
					<a
						class="Footer__link"
						href="https://www.instagram.com/pizza.party.peru"
						target="_blank"
					>
						<img class="Footer__ico" src="../assets/icons/instagram.svg" />
					</a>
					<a
						class="Footer__link"
						href="https://goo.gl/maps/nL7YBBZ12Rb7mVaUA"
						target="_blank"
					>
						<img class="Footer__ico" src="../assets/icons/maps.svg" />
					</a>
				</div>
			</div>
			<router-link to="/">
				<img class="Footer__logo" src="../assets/images/logoFull.webp" />
			</router-link>
			<div class="Footer__author">
				Made by:
				<a
					class="Footer__author"
					href="https://www.linkedin.com/in/bild-lopez-6128a0200/"
					target="_blank"
					>BildLa</a
				>
			</div>
		</div>
		<div class="Footer__spacer"></div>
	</footer>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "Footer",
	setup() {},
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Footer {
	background: $red;

	&__main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		min-height: 3rem;
		margin: 0 auto;
		padding: 1rem 0;
	}

	&__social {
		display: flex;
		align-items: center;
	}

	&__text {
		display: none;
		color: #fff;
	}

	&__links {
		display: flex;
		gap: 1rem;
	}

	&__link {
		cursor: pointer;
	}

	&__author {
		color: #fff;
		font-weight: 600;
	}

	&__logo {
		display: block;
		width: 3rem;
		height: auto;
		margin-left: 1rem;
	}

	&__author {
		color: #fff;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}

	&__spacer {
		height: 3.5rem;
	}

	@media (min-width: 768px) {
		&__text {
			display: inline;
		}

		&__logo {
			margin: 0;
			margin-right: 4rem;
		}
	}

	@media (min-width: 1024px) {
		&__spacer {
			display: none;
		}
	}
}
</style>
