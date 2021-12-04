import { ref } from "vue"

let showConfirmationModal = ref(false)
let confirmationPrice = ref(0)

export default function () {
	function openConfirmationModal(price: number) {
		confirmationPrice.value = price
		showConfirmationModal.value = true
	}

	function closeConfirmationModal() {
		showConfirmationModal.value = false
	}

	return {
		showConfirmationModal,
		openConfirmationModal,
		closeConfirmationModal,
		confirmationPrice,
	}
}
