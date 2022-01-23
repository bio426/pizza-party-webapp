import { ref, reactive } from "vue"

import { IProduct } from "../interfaces/products"

let showComboModal = ref(false)
let comboData = reactive<IProduct>({
  id: "",
  name: "",
  code: "",
	description: "",
  price: 0,
  tag: "",
	image: ""
})

export default function () {
	function openComboModal(combo: IProduct) {
		comboData = reactive<IProduct>({
			...combo,
		})
		showComboModal.value = true
	}

	function closeComboModal() {
		showComboModal.value = false
	}

	return { showComboModal, openComboModal, closeComboModal, comboData }
}
