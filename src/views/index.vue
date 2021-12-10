<template>
	<div class="index">
		<video class="index__video" autoplay loop muted ref="video">
			<source
				src="https://res.cloudinary.com/dvv00flyl/video/upload/v1619132299/pizza-opt/banner_vi8bgz.webm"
				type="video/webm"
			/>
		</video>
		<Navigation :cart="isNavFixed" />
		<div class="index__container">
			<h4 class="index__category" id="combosSection">Combos</h4>
			<div class="index__products index__products--combos" v-if="productsLoaded">
				<Product
					v-for="(combo, index) in combos"
					:key="index"
					:product="combo"
				/>
			</div>
			<div class="index__products index__products--combos" v-else>
				<Product v-for="i in 4" :key="i" :loading="true" />
			</div>
			<h4 class="index__category" id="classicsSection">Pizzas clasicas</h4>
			<div class="index__products">
				<Product
					v-for="(classic, index) in classics"
					:key="index"
					:product="classic"
					:extra-cheese="true"
				/>
			</div>
			<h4 class="index__category" id="premiumsSection">Pizzas premiums</h4>
			<div class="index__products">
				<Product
					v-for="(premium, index) in premiums"
					:key="index"
					:product="premium"
					:extra-cheese="true"
				/>
			</div>
			<h4 class="index__category" id="drinksSection">Bebidas</h4>
			<div class="index__products">
				<Product
					v-for="(drink, index) in drinks"
					:key="index"
					:product="drink"
				/>
			</div>
			<h4 class="index__category" id="extrasSection">Extras</h4>
			<div class="index__products">
				<Product
					v-for="(extra, index) in extras"
					:key="index"
					:product="extra"
				/>
			</div>
		</div>
		<div class="index__spacer"></div>
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref,computed, onMounted, onBeforeUnmount } from "vue"
import { useStore } from "vuex"
import {
	getFirestore,
	collection,
	getDocs,
	QuerySnapshot,
} from "firebase/firestore"

import { key } from "../store"
import useLargeScreen from "../hooks/useLargeScreen"
import { IProduct } from "../interfaces/products"

import Navigation from "../components/Navigation.vue"
import Product from "../components/Product.vue"

export default defineComponent({
	name: "index-view",
	components: {
		Navigation,
		Product,
	},
	setup() {
		const db = getFirestore()
		const store = useStore(key)

		// Toogle position of navigation
		const { isLarge } = useLargeScreen()
		let isNavFixed = ref(false)
		let video = ref()
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
		onMounted(() => {
			observer.observe(video.value)
		})
		onBeforeUnmount(() => {
			observer.disconnect()
		})

		// Get products
		let productsLoaded = ref(false)
		let combos = ref<IProduct[]>([])
		let classics = ref<IProduct[]>([])
		let premiums = ref<IProduct[]>([])
		let drinks = ref<IProduct[]>([])
		let extras = ref<IProduct[]>([])
		async function getProducts() {
			let snap = (await getDocs(
				collection(db, "products")
			)) as QuerySnapshot<IProduct>
			snap.forEach((doc) => {
				let rawProduct = doc.data()
				let product = {
					...rawProduct,
					id: doc.id,
				}
				switch (rawProduct.tag) {
					case "combo":
						combos.value.push(product)
						break
					case "classic":
						classics.value.push(product)
						store.commit({ type: "addComboSelectable", product })
						break
					case "premium":
						premiums.value.push(product)
						store.commit({ type: "addComboSelectable", product })
						break
					case "drink":
						drinks.value.push(product)
						if (product.code.includes("-s")) {
							store.commit({ type: "addComboSelectable", product })
						}
						break
					case "extra":
						extras.value.push(product)
						break
				}
			})
			productsLoaded.value = true
		}
		getProducts()

		let filterChicha = computed(()=>{
			let items: any[] = []
			drinks.value.forEach(drink=>{
				if(drink.code.includes("chi")){
					items.push(drink)
				}
			})
			return items
		})

		let filterLimonada = computed(()=>{
			let items: any[] = []
			drinks.value.forEach(drink=>{
				if(drink.code.includes("lim")){
					items.push(drink)
				}
			})
			return items
		})

		let filterMaracumango = computed(()=>{
			let items: any[] = []
			drinks.value.forEach(drink=>{
				if(drink.code.includes("mar")){
					items.push(drink)
				}
			})
			return items
		})

		return {
			video,
			isNavFixed,
			combos,
			classics,
			premiums,
			drinks,
			extras,
			productsLoaded,
			filterChicha,
			filterLimonada,
			filterMaracumango
		}
	},
})
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
				grid-template-columns: repeat(2, 1fr);
			}
		}
	}
}
</style>
