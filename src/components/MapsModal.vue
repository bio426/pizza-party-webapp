<template>
	<div class="Maps">
		<div class="Maps__main">
			<div class="Maps__head">
				<span class="Maps__title"> Selecciona tu direccion </span>
				<button class="Maps__close" @click="toogleMapsModal">
					<img class="Maps__ico" src="../assets/icons/close.svg" />
				</button>
			</div>
			<p class="Maps__info">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime modi
				veritatis obcaecati unde omnis. Ratione maxime similique explicabo
				quisquam repellendus!
			</p>
			<div class="Maps__alert">
				<img class="Maps__alertIco" src="../assets/icons/info.svg" />
				<p>
					Asegurate de incluir el numero en tu dirección, y seleccionar las
					opciones de la barra de busqueda.
				</p>
			</div>
			<div class="Maps__alert">
				<img class="Maps__alertIco" src="../assets/icons/info.svg" />
				<p>
					Puedes precizar tu direccion moviendo el mapa y situandola dentro de
					el circulo rojo.
				</p>
			</div>
			<input
				class="Maps__autocomplete"
				type="text"
				ref="mapInput"
				placeholder="Busca tu ubicación"
			/>
			<div class="Maps__view" ref="mapDiv"></div>
			<button class="Maps__button" @click="getMapCenter">
				Seleccionar direccion
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue"
import { useStore } from "vuex"
import { Loader } from "@googlemaps/js-api-loader"

import { key } from "../store"
import useMapsModal from "../hooks/useMapsModal"
import useNotification from "../hooks/useNotification"

export default defineComponent({
	name: "MapsModal",
	setup(props, ctx) {
		const store = useStore(key)
		const { toogleMapsModal } = useMapsModal()
		const { notyf } = useNotification()

		const loader = new Loader({
			apiKey: "AIzaSyDm6e078Cvj-HLlRZWBI3B540JexD1CyJk",
			version: "weekly",
			libraries: ["places"],
		})

		let mapDiv = ref<HTMLDivElement>()
		let mapInput = ref<HTMLInputElement>()
		let map: google.maps.Map
		let autocomplete: google.maps.places.Autocomplete
		let directions: google.maps.DirectionsService
		let baseAddress: google.maps.LatLngLiteral = {
			lat: -12.067664200000008,
			lng: -77.0716884,
		}
		let autocompleteBounds: google.maps.LatLngBoundsLiteral = {
			north: baseAddress.lat + 0.1,
			south: baseAddress.lat - 0.1,
			east: baseAddress.lng + 0.1,
			west: baseAddress.lng - 0.1,
		}

		onMounted(async () => {
			await loader.load()
			map = new google.maps.Map(mapDiv.value as HTMLDivElement, {
				center: baseAddress,
				zoom: 16,
				disableDefaultUI: true,
			})
			autocomplete = new google.maps.places.Autocomplete(
				mapInput.value as HTMLInputElement,
				{
					types: ["address"],
					componentRestrictions: { country: ["PE"] },
					fields: ["formatted_address", "geometry", "name"],
					bounds: autocompleteBounds,
				}
			)
			autocomplete.addListener("place_changed", handlePlaceChange)
			directions = new google.maps.DirectionsService()
		})

		function handlePlaceChange() {
			let result = autocomplete.getPlace()
			if (!result.geometry) return 0
			let center = result.geometry.location
			if (!center) throw new Error("Failed places service")
			map.panTo({ lat: center.lat(), lng: center.lng() })
		}

		async function getMapCenter() {
			let center = map.getCenter()
			let place = autocomplete.getPlace()
			if (!center) return 0

			let result = await directions.route({
				origin: { lat: -12.067664200000008, lng: -77.0716884 },
				destination: { lat: center.lat(), lng: center.lng() },
				travelMode: google.maps.TravelMode.DRIVING,
			})

			let rawAddress = place.formatted_address || "Sin dirección"
			let prettyAddress = rawAddress.split(",", 2).join(",")
			let toCompare = rawAddress.split(",", 1)
			let containNumbers = toCompare[0].match(/\d+/g)
			if (containNumbers == null) {
				notyf.error("No se detecto numero en la direccion seleccionada")
			}

			store.commit({
				type: "setUserAddress",
				cords: { lat: center.lat(), lng: center.lng() },
				name: prettyAddress,
				distance: result.routes[0].legs[0].distance?.value || 0,
				travelTime: result.routes[0].legs[0].duration?.value || 0,
			})
			toogleMapsModal()
		}

		return {
			toogleMapsModal,
			mapDiv,
			mapInput,
			getMapCenter,
		}
	},
})
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.Maps {
	@include modal;

	&__alert{
		margin-top: .5rem;
	}

	&__view {
		height: 20rem;
		margin: 1rem 0;
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

	&__info {
		margin: 1rem 0;
	}

	&__autocomplete {
		width: 100%;
		margin-top: 1rem;
		padding: 0.5rem;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
