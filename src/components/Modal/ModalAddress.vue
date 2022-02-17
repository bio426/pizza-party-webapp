<template>
	<ModalBase
		title="Selecciona tu dirección gaa"
		@close-modal="$emit('closeSelector')"
	>
		<div class="ASelector">
			<p class="ASelector__info">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid cumque
				nobis iure rerum quis accusamus, beatae est placeat aperiam odio id
				ratione cum culpa nulla perspiciatis iusto. Eveniet, cupiditate facilis!
			</p>
			<div class="ASelector__alert">
				<img
					class="ASelector__ico"
					src="../../assets/icons/info.svg"
					alt="alert ico"
				/>
				<p>
					Asegurate de incluir el numero en tu dirección, y seleccionar las
					opciones de la barra de busqueda.
				</p>
			</div>
			<label class="ASelector__label">
				Busca tu dirección
				<input
					class="ASelector__autocomplete"
					type="text"
					placeholder="ej. Av. Mariano Cornejo 1902"
					ref="autocompleteInput"
				/>
			</label>
			<div class="ASelector__map" ref="mapView"></div>
			<button class="ASelector__button" @click="selectAddress">
				Seleccionar dirección
			</button>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

import ModalBase from "./ModalBase.vue"

import { useStore } from "../../store"
import useNotyf from "../../composables/useNotyf"
import MapsService from "../../services/MapsService"

const emits = defineEmits(["closeSelector"])
const store = useStore()
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
	if(!autocompleteInput.value) return "Undefined"
	let raw = autocompleteInput.value.value
	let name = raw.split(",",1)[0]
	return name
}

function addresHasNumbers() {
	if (!autocompleteInput.value) return false
	let raw = autocompleteInput.value.value || "undefined,undefined"
	let toCompare = raw.split(",", 1)
	let containNumbers = toCompare[0].match(/\d+/g)
	return containNumbers != null
}

async function selectAddress() {
	if (!addresHasNumbers()) {
		notyf.error("No se detecto numero en la direccion seleccionada")
		return 0
	}
	let mapCenter = mapInstance.getCenter()
	if (!mapCenter) return 0
	const { travelTime, distance } = await MapsService.getTravelInfo(mapCenter)
	store.commit({
		type: "setUserAddress",
		cords: { lat: mapCenter.lat(), lng: mapCenter.lng() },
		name: getAddress(),
		travelTime,
		distance,
	})
	emits("closeSelector")
}
</script>

<style lang="scss">
.ASelector {
	&__info {
		margin-bottom: 1rem;
	}

	&__alert {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border-radius: 0.5rem;
		font-size: 0.9rem;
	}

	&__ico {
		display: block;
		width: 1rem;
		height: auto;
	}

	&__label {
		display: block;
		margin-bottom: 1rem;
	}

	&__autocomplete {
		display: block;
		width: 100%;
		margin-top: 0.5rem;
		padding: 0.5rem;
	}

	&__map {
		position: relative;
		margin-bottom: 1rem;
		height: 20rem;
		border: 1px solid #000;

		&::after {
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
	}

	&__button {
		display: block;
		width: 100%;
		padding: 0.5rem;
		background: $green;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;

		&:active {
			background: darken($color: $green, $amount: 10%);
		}
	}
}
</style>
