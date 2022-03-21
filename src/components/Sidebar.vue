<template>
	<div class="fixed top-0 w-full h-screen bg-modal z-20">
		<transition name="slide">
			<div class="absolute right-0 w-4/5 h-full p-6 bg-white" v-if="showMain">
				<div class="flex justify-end">
					<button @click="$emit('hideSidebar')">
						<img class="block w-6" src="../assets/icons/close.svg" />
					</button>
				</div>
				<div class="flex flex-col items-center">
					<img class="block w-32 my-8" src="../assets/images/logoFull.webp" />
					<router-link class="mb-4 text-xl" to="/">Menu</router-link>
					<a
						class="mb-4 text-xl"
						href="https://res.cloudinary.com/pizza-party/image/upload/v1647637341/pizza-products-v2/carta_wahv0b.webp"
						download
						>Carta</a
					>
					<div class="flex gap-4">
						<a
							class="flex justify-center items-center w-10 h-10 bg-black rounded-full"
							href="https://www.facebook.com/todalapizzaquepuedas"
						>
							<img class="block w-6" src="../assets/icons/facebook.svg" />
						</a>
						<a
							class="flex justify-center items-center w-10 h-10 bg-black rounded-full"
							href="https://www.instagram.com/pizza.party.peru"
						>
							<img class="block w-6" src="../assets/icons/instagram.svg" />
						</a>
						<a
							class="flex justify-center items-center w-10 h-10 bg-black rounded-full"
							href="https://goo.gl/maps/nL7YBBZ12Rb7mVaUA"
						>
							<img class="block w-6" src="../assets/icons/maps.svg" />
						</a>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue"

let showMain = ref(false)

onMounted(() => (showMain.value = true))
</script>

<style>
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}
</style>
