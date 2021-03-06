<template>
	<ModalBase
		title="Selecciona tu dirección"
		@close-modal="$emit('closeSelector')"
	>
		<div>
			<div class="flex gap-2 mb-4 p-2 bg-yellow-500 rounded-lg text-sm">
				<img
					class="block w-4"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p>
					Asegurate de incluir el numero en tu dirección, y seleccionar las
					opciones de la barra de busqueda.
				</p>
			</div>
			<label class="block mb-4">
				Busca tu dirección
				<input
					class="block w-full mt-2 p-2 border border-gray-400"
					type="text"
					placeholder="ej. Av. Mariano Cornejo 1902"
					ref="autocompleteInput"
				/>
			</label>
			<div
				class="relative h-80 mb-4 border border-gray-400 map-marker"
				ref="mapView"
			></div>
			<button
				class="block w-full p-2 bg-red-500 active:bg-green-600 text-white rounded-lg font-bold"
				@click="selectAddress"
			>
				Seleccionar dirección
			</button>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

import ModalBase from "./ModalBase.vue"

import useUserStore from "../../composables/useUserStore"
import useNotyf from "../../composables/useNotyf"
import MapsService from "../../services/MapsService"

const emits = defineEmits(["closeSelector"])
const { updateAddress } = useUserStore()
const { notyf } = useNotyf()

let mapView = ref<HTMLDivElement>()
let mapInstance: google.maps.Map
let autocompleteInput = ref<HTMLInputElement>()
let autocompleteInstance: google.maps.places.Autocomplete
onMounted(() => {
	mapInstance = MapsService.getMap(mapView.value as HTMLDivElement)
	autocompleteInstance = MapsService.getAutocomplete(
		autocompleteInput.value as HTMLInputElement
	)
	autocompleteInstance.addListener("place_changed", onAutocompleteChange)
})

function onAutocompleteChange() {
	let res = autocompleteInstance.getPlace()
	let center = res.geometry?.location
	if (!center) return console.error("Error im autocomplete")
	mapInstance.panTo({ lat: center?.lat(), lng: center?.lng() })
}

function getAddress() {
	if (!autocompleteInput.value) return "Undefined"
	let raw = autocompleteInput.value.value
	let name = raw.split(",", 1)[0]
	return name
}

function validateAddress() {
	if (!autocompleteInput.value) return false
	let raw = autocompleteInput.value.value || "undefined,undefined"
	let toCompare = raw.split(",", 1)
	let containNumbers = toCompare[0].match(/\d+/g)
	return containNumbers != null
}

async function selectAddress() {
	if (!validateAddress()) {
		notyf.error("No se detecto numero en la direccion seleccionada")
		return 0
	}
	let mapCenter = mapInstance.getCenter()
	if (!mapCenter) return 0
	const { travelTime, distance } = await MapsService.getTravelInfo(mapCenter)
	let freeDelivery = MapsService.isFreeDelivery({
		lat: mapCenter.lat(),
		lng: mapCenter.lng(),
	})
	updateAddress({
		cords: { lat: mapCenter.lat(), lng: mapCenter.lng() },
		travelTime: Math.round(travelTime / 60),
		distance: distance,
		name: getAddress(),
		freeDelivery,
	})
	emits("closeSelector")
}
</script>

<style>
.map-marker::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 1rem;
	height: 1rem;
	border: 2px solid red;
	border-radius: 50%;
}
</style>
