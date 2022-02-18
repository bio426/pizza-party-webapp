<template>
	<footer class="bg-red-500">
		<div class="flex justify-between items-center w-9/10 mx-auto py-4">
			<div class="flex items-center">
				<span class="hidden md:inline mr-2 text-white">Siguenos en:</span>
				<div class="flex gap-4">
					<a
						href="https://www.facebook.com/todalapizzaquepuedas"
						target="_blank"
					>
						<img class="block w-6" src="../assets/icons/facebook.svg" />
					</a>
					<a href="https://www.instagram.com/pizza.party.peru" target="_blank">
						<img class="block w-6" src="../assets/icons/instagram.svg" />
					</a>
					<a href="https://goo.gl/maps/nL7YBBZ12Rb7mVaUA" target="_blank">
						<img class="block w-6" src="../assets/icons/maps.svg" />
					</a>
				</div>
			</div>
			<router-link to="/">
				<img
					class="block w-12 ml-4 md:ml-0 md:mr-16"
					src="../assets/images/logoFull.webp"
				/>
			</router-link>
			<div class="text-white">
				Made by:
				<a
					class="underline font-medium"
					href="https://www.linkedin.com/in/bild-lopez-6128a0200/"
					target="_blank"
					>BildLa</a
				>
			</div>
		</div>
		<div class="h-14 lg:hidden"></div>
	</footer>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "Footer",
	setup() {},
})
</script>

<style></style>
