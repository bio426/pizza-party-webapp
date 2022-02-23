import { computed, reactive } from "vue"

import useKitchenStore from "./useKitchenStore"

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
})

let deliveryPrice = computed(() => {
	let distanceKm = Math.round(address.distance / 1000)
	if(distanceKm < 2.5){
		return distanceKm * 2	
	}
	return distanceKm * kitchenStore.deliveryPrice
})

function updateAddress(newAddress: typeof address) {
	address.cords = newAddress.cords
	address.name = newAddress.name
	address.travelTime = newAddress.travelTime
	address.distance = newAddress.distance
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
