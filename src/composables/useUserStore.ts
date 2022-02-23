import { computed, reactive, readonly } from "vue"

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
	deliveryTime: 0,
	distance: 0,
})

let deliveryPrice = computed(
	() =>
		Math.floor(Math.round(address.distance / 1000)) * kitchenStore.deliveryPrice
)

function updateAddress(newAddress: typeof address) {
	address.cords = newAddress.cords
	address.name = newAddress.name
	address.deliveryTime = newAddress.deliveryTime
	address.distance = newAddress.distance
}

export default function () {
	return {
		user: readonly(user),
		address: readonly(address),
		updateAddress,
		deliveryPrice,
	}
}
