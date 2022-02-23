import { reactive, readonly } from "vue"

import { IAdminStatus } from "../interfaces"
import FirestoreService from "../services/FirestoreService"

const kitchenStatus = reactive<IAdminStatus>({
	deliveryPrice: 1.5,
	extraCheesePrice: 2.5,
	kitchenActive: false,
	kitchenWaitTime: 10,
})

async function updateKitchenStore() {
	let newStatus = await FirestoreService.getKitchenStatus()
	kitchenStatus.deliveryPrice = newStatus.deliveryPrice
	kitchenStatus.extraCheesePrice = newStatus.extraCheesePrice
	kitchenStatus.kitchenActive = newStatus.kitchenActive
	kitchenStatus.kitchenWaitTime = newStatus.kitchenWaitTime
  console.log("kitchen store updated")
}
updateKitchenStore()

export default function () {
	return { kitchenStore: readonly(kitchenStatus), updateKitchenStore }
}
