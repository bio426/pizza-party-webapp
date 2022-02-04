import { Loader } from "@googlemaps/js-api-loader"

class MapsService {
	private loaderInstance: Loader
	private readonly baseCords = { lat: -12.067664200000008, lng: -77.0716884 }
	private readonly autocompleteBounds = {
		north: this.baseCords.lat + 0.1,
		south: this.baseCords.lat - 0.1,
		east: this.baseCords.lng + 0.1,
		west: this.baseCords.lng - 0.1,
	}
	private directionsInstance: google.maps.DirectionsService | undefined

	constructor() {
		this.loaderInstance = new Loader({
			apiKey: "AIzaSyDxgoTxRbW1eeqSg4_j8uuclTyHVZl0xRs",
			version: "weekly",
			libraries: ["places"],
		})
		this.loaderInstance.load().then(() => {
			this.directionsInstance = new google.maps.DirectionsService()
		})
	}

	getMap(div: HTMLDivElement) {
		return new google.maps.Map(div, {
			center: this.baseCords,
			zoom: 16,
			disableDefaultUI: true,
		})
	}

	getAutocomplete(input: HTMLInputElement) {
		return new google.maps.places.Autocomplete(input, {
			types: ["address"],
			componentRestrictions: { country: ["PE"] },
			fields: ["formatted_address", "geometry", "name"],
			bounds: this.autocompleteBounds,
		})
	}

	async getTravelInfo(destination: google.maps.LatLng) {
		if (!this.directionsInstance) throw new Error("Directions not initialized")
		let res = await this.directionsInstance.route({
			origin: this.baseCords,
			destination,
			travelMode: google.maps.TravelMode.DRIVING,
		})
		let travelTime = res.routes[0].legs[0].duration?.value || 0
		let distance = res.routes[0].legs[0].distance?.value || 0

		return { travelTime, distance }
	}
}

export default new MapsService()
