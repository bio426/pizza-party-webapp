<template>
	<Header @showSidebar="activeSidebar = true" />
	<router-view />
	<Sidebar v-if="activeSidebar" @hideSidebar="activeSidebar = false" />
	<FloatCart v-if="!isLarge" />
	<Cart v-if="showCart" />
	<ComboModal v-if="showComboModal" />
	<MapsModal v-if="showMapsModal" />
	<ConfirmationModal v-if="showConfirmationModal" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { useRoute } from "vue-router"

import useLargeScreen from "./hooks/useLargeScreen"
import useCart from "./hooks/useCart"
import useComboModal from "./hooks/useComboModal"
import useMapsModal from "./hooks/useMapsModal"
import useConfirmationModal from "./hooks/useConfirmationModal"

import Header from "./components/Header.vue"
import Sidebar from "./components/Sidebar.vue"
import FloatCart from "./components/FloatCart.vue"
import Cart from "./components/Cart.vue"
import ComboModal from "./components/ComboModal.vue"
import MapsModal from "./components/MapsModal.vue"
import ConfirmationModal from "./components/ConfirmationModal.vue"

export default defineComponent({
	name: "app",
	components: {
		Header,
		Sidebar,
		FloatCart,
		Cart,
		ComboModal,
		MapsModal,
		ConfirmationModal,
	},
	setup() {
		const route = useRoute()

		let activeSidebar = ref(false)
		const { showComboModal } = useComboModal()
		const { showCart } = useCart()
		const { showMapsModal } = useMapsModal()
		const { showConfirmationModal } = useConfirmationModal()

		watch(
			() => route.path,
			(to, from) => {
				activeSidebar.value = false
			}
		)

		const { isLarge } = useLargeScreen()

		return {
			activeSidebar,
			showComboModal,
			showCart,
			showMapsModal,
			isLarge,
			showConfirmationModal,
		}
	},
})
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: sans-serif;
}
html {
	scroll-behavior: smooth;
}
</style>
