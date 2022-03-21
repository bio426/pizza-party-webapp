import { computed, reactive } from "vue"

import useKitchenStore from "./useKitchenStore"
import MapsService from "../services/MapsService"

const { kitchenStore } = useKitchenStore()

const user = reactive({
	id: undefined,
	name: "",
	phone: "",
})

const address = reactive({
	cords: {
		lat: 0,
		lng: 0,
	},
	name: "",
	travelTime: 0,
	distance: 0,
	freeDelivery: false,
})

let deliveryPrice = computed(() => {
	// if (MapsService.isInFreeArea(address.cords)) return 0
	if (address.freeDelivery) return 0
	let distanceKm = Math.round(address.distance / 1000)
	if (distanceKm < 2.5) {
		return distanceKm * 2
	}
	return distanceKm * kitchenStore.deliveryPrice
})

function updateAddress(newAddress: typeof address) {
	address.cords = newAddress.cords
	address.name = newAddress.name
	address.travelTime = newAddress.travelTime
	address.distance = newAddress.distance
	address.freeDelivery = newAddress.freeDelivery
	console.log(address.travelTime)
}

export default function () {
	return {
		user,
		address,
		updateAddress,
		deliveryPrice,
	}
}
