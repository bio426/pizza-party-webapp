import { ref } from "vue"

let showCart = ref(false)

export default function () {
	function toogleCart() {
		showCart.value = !showCart.value
	}

	return {
		showCart,
		toogleCart,
	}
}
