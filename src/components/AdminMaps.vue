<template>
	<div class="AdminMaps">
		<div class="AdminMaps__view" ref="mapsDiv"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType } from "vue"
import { Loader } from "@googlemaps/js-api-loader"

export default defineComponent({
	name: "AdminMaps",
	props: {
		cords: {
			type: Object as PropType<google.maps.LatLngLiteral>,
			required: true
		},
	},
	setup(props, ctx) {
		// const loader = new Loader({
		// 	apiKey: "AIzaSyDxgoTxRbW1eeqSg4_j8uuclTyHVZl0xRs",
		// 	version: "weekly",
		// 	libraries: ["places"],
		// })
		let mapsDiv = ref<HTMLDivElement>()
		let map: google.maps.Map
		onMounted(async () => {
			// await loader.load()
			// map = new google.maps.Map(mapsDiv.value as HTMLDivElement, {
			// 	center: {
			// 		lat: -12.067664200000008,
			// 		lng: -77.0716884,
			// 	},
			// 	zoom: 18,
			// 	disableDefaultUI: true,
			// })
		})

		watch(
			() => props.cords.lat,
			(actual, previous) => {
				map.panTo(props.cords)
			}
		)

		return {
			mapsDiv,
		}
	},
})
</script>

<style lang="scss">
.AdminMaps {
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);

	&__view {
		position: relative;
		height: 20rem;

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
}
</style>
