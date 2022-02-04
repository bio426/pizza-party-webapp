<template>
	<div class="Status">
		<span class="Status__subtitle">
			Carga de cocina actual: {{ formatedLoad }}
		</span>
		<select class="Status__select" v-model="load" :disabled="gettingLoad">
			<option :value="0" disabled>Cambiar la carga</option>
			<option :value="1">Baja</option>
			<option :value="2">Media</option>
			<option :value="3">Alta</option>
		</select>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from "vue"

import FirestoreService from "../../services/FirestoreService"
import { IAdminStatus } from "../../interfaces"

let gettingLoad = ref(true)
let load = ref(0)
const unsubscribe = FirestoreService.subscribeKitchenLoad((doc) => {
	let raw = { ...doc.data() } as IAdminStatus
	load.value = raw.kitchenLoad
	gettingLoad.value = false
})
onBeforeUnmount(() => unsubscribe())

watch(
	() => load.value,
	(to, from) => {
		gettingLoad.value = true
		FirestoreService.updateKitchenLoad(to).then(() => {
			gettingLoad.value = false
		})
	}
)

let formatedLoad = computed<string>(() => {
	if (load.value == 1) return "baja"
	if (load.value == 2) return "media"
	if (load.value == 3) return "alta"
	return "cargando..."
})
</script>

<style lang="scss">
.Status {
	display: block;
	width: 100%;
	margin-bottom: 1rem;
	padding: 1rem;
	background: #fff;
	border-radius: 0.5rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);

	&__subtitle {
		display: block;
		margin-bottom: 1rem;
		font-weight: 600;
		font-size: 1.4rem;
	}

	&__select {
		display: block;
		width: 50%;
		padding: 0.5rem;
		font-size: 1rem;
	}
}
</style>
