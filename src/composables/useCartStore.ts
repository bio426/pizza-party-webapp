import { ref, reactive, readonly, computed } from "vue"

import { ICartItem } from "../interfaces"

const cart = ref<ICartItem[]>([])

const cartPrice = computed(() => {
	let price = 0
	cart.value.forEach((item) => {
		price += item.price * item.quantity
	})
	return price
})

function addToCart(item: ICartItem) {
	cart.value.push(item)
}

export default { cart: readonly(cart), cartPrice, addToCart }
