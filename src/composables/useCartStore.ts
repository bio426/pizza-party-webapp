import { ref, readonly, computed } from "vue"

import { ICartItem } from "../interfaces"

const cart = ref<ICartItem[]>([])

const cartPrice = computed(() => {
	let price = 0
	cart.value.forEach((item) => {
		price += item.price * item.quantity
	})
	return price
})

const pizzaCount = computed(() => {
	let count = 0
	cart.value.map((item) => {
		if (item.tag == "classic" || item.tag == "premium") {
			count++
		}
		if (item.tag == "combo" && item.contains) {
			count += item.contains.pizza?.length || 0
		}
	})
	return count
})

function addItem(item: ICartItem) {
	if (item.tag == "combo" || cart.value.length == 0) {
		cart.value.push(item)
	} else {
		for (let i = 0; i < cart.value.length; i++) {
			let sameCode = cart.value[i].code == item.code
			let equalCheese = typeof cart.value[i].contains == typeof item.contains
			if (sameCode && equalCheese) {
				cart.value[i].quantity += 1
				return
			}
		}
		cart.value.push(item)
	}
}

function removeItem(index: number) {
	cart.value.splice(index, 1)
}

function clearCart() {
	cart.value = []
}

function changeItemQuantity(index: number, change: number) {
	if (cart.value[index].quantity + change < 1) return
	cart.value[index].quantity += change
}

export default function () {
	return {
		cart,
		cartPrice,
		pizzaCount,
		addItem,
		removeItem,
		clearCart,
		changeItemQuantity,
	}
}
