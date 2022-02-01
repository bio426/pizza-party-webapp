<template>
	<Header @showSidebar="activeSidebar = true" />
	<router-view />
	<Footer />
	<Sidebar v-if="activeSidebar" @hideSidebar="activeSidebar = false" />
	<FloatCart v-if="!isLarge" />
	<Cart v-if="showCart" />
	<MapsModal v-if="showMapsModal" />
	<ConfirmationModal v-if="showConfirmationModal" />
	<div id="modals"></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

import useLargeScreen from "./hooks/useLargeScreen"
import useCart from "./hooks/useCart"
import useMapsModal from "./hooks/useMapsModal"
import useConfirmationModal from "./hooks/useConfirmationModal"

import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import Sidebar from "./components/Sidebar.vue"
import FloatCart from "./components/FloatCart.vue"
import Cart from "./components/Cart.vue"
import MapsModal from "./components/MapsModal.vue"
import ConfirmationModal from "./components/ConfirmationModal.vue"

const route = useRoute()

let activeSidebar = ref(false)
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
