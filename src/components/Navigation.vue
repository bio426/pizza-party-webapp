<template>
	<div class="sticky top-0 w-full bg-yellow-500 shadow-lg z-10">
		<div class="flex md:justify-center px-4 overflow-x-auto">
			<a
				class="flex items-center gap-2 py-4 px-6 text-black font-bold"
				href="#combosSection"
				:class="{ 'text-red-500 border-b-2 border-green-500': activeLink == 1 }"
				@click="activeLink = 1"
			>
				<img class="block w-6" src="../assets/icons/combos.svg" />
				Combos</a
			>
			<a
				class="flex items-center gap-2 py-4 px-6 text-black font-bold"
				href="#classicsSection"
				:class="{ 'text-red-500 border-b-2 border-green-500': activeLink == 2 }"
				@click="activeLink = 2"
			>
				<img class="block w-6" src="../assets/icons/pizza.svg" />
				Clasicas</a
			>
			<a
				class="flex items-center gap-2 py-4 px-6 text-black font-bold"
				href="#premiumsSection"
				:class="{ 'text-red-500 border-b-2 border-green-500': activeLink == 3 }"
				@click="activeLink = 3"
			>
				<img class="block w-6" src="../assets/icons/special.svg" />Premium</a
			>
			<a
				class="flex items-center gap-2 py-4 px-6 text-black font-bold"
				href="#drinksSection"
				:class="{ 'text-red-500 border-b-2 border-green-500': activeLink == 4 }"
				@click="activeLink = 4"
			>
				<img class="block w-6" src="../assets/icons/drinks.svg" />
				Bebidas</a
			>
			<a
				class="flex items-center gap-2 py-4 px-6 text-black font-bold"
				href="#extrasSection"
				:class="{ 'text-red-500 border-b-2 border-green-500': activeLink == 5 }"
				@click="activeLink = 5"
			>
				<img class="block w-6" src="../assets/icons/extras.svg" />
				Extras</a
			>
			<div class="flex items-center" v-if="cart">
				<button
					class="flex items-center gap-2 py-2 px-4 bg-red-500 text-white rounded-lg font-bold"
					ref="cartButton"
					@click="toogleCart"
				>
					<img class="block w-6" src="../assets/icons/cart.svg" />
					S/ {{ cartPrice.toFixed(2) }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import useCartStore from "../composables/useCartStore"
import useCart from "../composables/useCart"

const props = defineProps({
	cart: {
		type: Boolean,
		default: false,
	},
})

const { cartPrice } = useCartStore()
const { toogleCart } = useCart()

let activeLink = ref(1)

let cartButton = ref<HTMLButtonElement>()
function onCartAdd() {
	cartButton.value?.classList.add("animate__animated", "animate__headShake")
	cartButton.value?.addEventListener("animationend", (e) => {
		e.stopPropagation()
		cartButton.value?.classList.remove(
			"animate__animated",
			"animate__headShake"
		)
	})
}

watch(
	() => cartPrice.value,
	(now, prev) => {
		onCartAdd()
	}
)
</script>

<style>
.animate__animated {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}
@keyframes headShake {
	0% {
		-webkit-transform: translateX(0);
		transform: translateX(0);
	}

	6.5% {
		-webkit-transform: translateX(-6px) rotateY(-9deg);
		transform: translateX(-6px) rotateY(-9deg);
	}

	18.5% {
		-webkit-transform: translateX(5px) rotateY(7deg);
		transform: translateX(5px) rotateY(7deg);
	}

	31.5% {
		-webkit-transform: translateX(-3px) rotateY(-5deg);
		transform: translateX(-3px) rotateY(-5deg);
	}

	43.5% {
		-webkit-transform: translateX(2px) rotateY(3deg);
		transform: translateX(2px) rotateY(3deg);
	}

	50% {
		-webkit-transform: translateX(0);
		transform: translateX(0);
	}
}
.animate__headShake {
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-name: headShake;
	animation-name: headShake;
}
</style>
