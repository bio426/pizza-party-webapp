<template>
	<div class="relative w-full min-h-screen bg-page bg-repeat">
		<video class="w-full" autoplay loop muted ref="videoElement">
			<source
				src="https://res.cloudinary.com/dvv00flyl/video/upload/v1619132299/pizza-opt/banner_vi8bgz.webm"
				type="video/webm"
			/>
		</video>
		<Navigation :cart="isNavFixed" />
		<div class="w-9/10 mx-auto">
			<div v-if="!productsLoaded">
				<h4 class="my-8 text-center text-lg font-bold">Combos</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Product v-for="i in 4" :key="i" />
				</div>
			</div>
			<div v-else>
				<h4 class="my-8 text-center text-lg font-bold" id="combosSection">
					Combos
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Product
						v-for="combo in combos"
						:key="combo.id"
						:product="combo"
						@build-combo="chooseCombo(combo)"
					/>
				</div>
				<h4 class="my-8 text-center text-lg font-bold" id="classicsSection">
					Pizzas clasicas
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<Product
						v-for="classic in classics"
						:key="classic.id"
						:product="classic"
					/>
				</div>
				<h4 class="my-8 text-center text-lg font-bold" id="premiumsSection">
					Pizzas premiums
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<Product
						v-for="premium in premiums"
						:key="premium.id"
						:product="premium"
					/>
				</div>
				<h4 class="my-8 text-center text-lg font-bold" id="drinksSection">
					Bebidas
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<ProductSelect :products="filterChicha" />
					<ProductSelect :products="filterLimonada" />
					<ProductSelect :products="filterMaracumango" />
				</div>
				<h4 class="my-8 text-center text-lg font-bold" id="extrasSection">
					Extras
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<Product v-for="extra in extras" :key="extra.id" :product="extra" />
				</div>
			</div>
		</div>
		<div class="h-8"></div>
		<ModalCombo
			v-if="showModalCombo"
			:combo="baseCombo"
			:options="comboOptions"
			@close-selector="showModalCombo = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue"

import useLargeScreen from "../composables/useLargeScreen"
import { IProduct } from "../interfaces"

import FirestoreService from "../services/FirestoreService"

import Navigation from "../components/Navigation.vue"
import Product from "../components/Product.vue"
import ProductSelect from "../components/ProductSelect.vue"
import ModalCombo from "../components/Modal/ModalCombo.vue"

// Toogle position of navigation
const { isLarge } = useLargeScreen()
let isNavFixed = ref(false)
let videoElement = ref()
let observer = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (entry.intersectionRatio == 0 && isLarge.value) {
				isNavFixed.value = true
			} else {
				isNavFixed.value = false
			}
		})
	},
	{ threshold: 0 }
)
onMounted(() => observer.observe(videoElement.value))
onBeforeUnmount(() => observer.disconnect())

// Get products
let productsLoaded = ref(false)
let combos = ref<IProduct[]>([])
let classics = ref<IProduct[]>([])
let premiums = ref<IProduct[]>([])
let filterChicha = ref<IProduct[]>([])
let filterLimonada = ref<IProduct[]>([])
let filterMaracumango = ref<IProduct[]>([])
let extras = ref<IProduct[]>([])
let comboOptions = ref<IProduct[]>([])

FirestoreService.getProducts().then((products) => {
	combos.value = products.filter((product) => product.tag == "combo")
	classics.value = products.filter((product) => product.tag == "classic")
	premiums.value = products.filter((product) => product.tag == "premium")
	extras.value = products.filter((product) => product.tag == "extra")
	filterChicha.value = products.filter((product) =>
		product.code.includes("chi")
	)
	filterChicha.value.sort((a, b) => a.price - b.price)
	filterLimonada.value = products.filter((product) =>
		product.code.includes("lim")
	)
	filterLimonada.value.sort((a, b) => a.price - b.price)
	filterMaracumango.value = products.filter((product) =>
		product.code.includes("mar")
	)
	filterMaracumango.value.sort((a, b) => a.price - b.price)
	let smallDrinks = products.filter((product) => product.code.includes("-s"))
	comboOptions.value = [...classics.value, ...premiums.value, ...smallDrinks]
	productsLoaded.value = true
})

// Handle ModalCombo
let showModalCombo = ref(false)
let baseCombo: IProduct = reactive({
	code: "",
	description: "",
	id: "",
	image: "",
	name: "",
	tag: "",
	price: 0,
	includes: {},
})

function chooseCombo(combo: IProduct) {
	baseCombo.code = combo.code
	baseCombo.description = combo.description
	baseCombo.id = combo.id
	baseCombo.image = combo.image
	baseCombo.name = combo.name
	baseCombo.tag = combo.tag
	baseCombo.price = combo.price
	baseCombo.includes = combo.includes
	showModalCombo.value = true
}
</script>

<style>
.bg-page {
	background-image: url("../assets/images/fondoPizza.webp");
}
</style>
