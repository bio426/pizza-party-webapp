<template>
	<div class="index">
		<video class="index__video" autoplay loop muted ref="videoElement">
			<source
				src="https://res.cloudinary.com/dvv00flyl/video/upload/v1619132299/pizza-opt/banner_vi8bgz.webm"
				type="video/webm"
			/>
		</video>
		<Navigation :cart="isNavFixed" />
		<div class="index__container">
			<div v-if="!productsLoaded">
				<h4 class="index__category" id="combosSection">Combos</h4>
				<div
					class="index__products index__products--combos"
					v-if="!productsLoaded"
				>
					<Product v-for="i in 4" :key="i" />
				</div>
			</div>
			<div v-else>
				<h4 class="index__category" id="combosSection">Combos</h4>
				<div class="index__products index__products--combos">
					<Product
						v-for="combo in combos"
						:key="combo.id"
						:product="combo"
						@build-combo="chooseCombo(combo)"
					/>
				</div>
				<h4 class="index__category" id="classicsSection">Pizzas clasicas</h4>
				<div class="index__products">
					<Product
						v-for="classic in classics"
						:key="classic.id"
						:product="classic"
					/>
				</div>
				<h4 class="index__category" id="premiumsSection">Pizzas premiums</h4>
				<div class="index__products">
					<Product
						v-for="premium in premiums"
						:key="premium.id"
						:product="premium"
					/>
				</div>
				<h4 class="index__category" id="drinksSection">Bebidas</h4>
				<div class="index__products">
					<ProductSelect :products="filterChicha" />
					<ProductSelect :products="filterLimonada" />
					<ProductSelect :products="filterMaracumango" />
				</div>
				<h4 class="index__category" id="extrasSection">Extras</h4>
				<div class="index__products">
					<Product v-for="extra in extras" :key="extra.id" :product="extra" />
				</div>
			</div>
		</div>
		<div class="index__spacer"></div>
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
	filterLimonada.value = products.filter((product) =>
		product.code.includes("lim")
	)
	filterMaracumango.value = products.filter((product) =>
		product.code.includes("mar")
	)
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

<style lang="scss">
@import "../assets/styles/mixins";

.index {
	@include page;

	&__video {
		width: 100%;
	}

	&__container {
		width: 90%;
		margin: 0 auto;
	}

	&__category {
		margin: 2rem 0;
		text-align: center;
		font-size: 1.2rem;
	}

	&__products {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-top: 1rem;
	}

	&__spacer {
		height: 2rem;
	}

	@media (min-width: 768px) {
		&__products {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		&__products {
			grid-template-columns: repeat(3, 1fr);

			&--combos {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
}
</style>
