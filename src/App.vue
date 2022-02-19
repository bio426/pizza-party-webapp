<template>
	<Header @showSidebar="activeSidebar = true" />
	<router-view />
	<Footer />
	<Sidebar v-if="activeSidebar" @hideSidebar="activeSidebar = false" />
	<FloatCart v-if="!isLarge" />
	<Cart v-if="showCart" />
	<div id="modals"></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

import useLargeScreen from "./composables/useLargeScreen"
import useCart from "./composables/useCart"

import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import Sidebar from "./components/Sidebar.vue"
import FloatCart from "./components/FloatCart.vue"
import Cart from "./components/Cart.vue"

const route = useRoute()

let activeSidebar = ref(false)
const { showCart } = useCart()

watch(
	() => route.path,
	(to, from) => {
		activeSidebar.value = false
	}
)

const { isLarge } = useLargeScreen()
</script>

<style>
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
