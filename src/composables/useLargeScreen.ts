import { ref, onBeforeUnmount } from "vue"

export default function () {
	const isLargeMQ = window.matchMedia("(min-width: 1024px)")
	let isLarge = ref<boolean>()
	if (isLargeMQ.matches) {
		isLarge.value = true
	}
	function handleChange(e: MediaQueryListEvent) {
		if (e.matches) {
			isLarge.value = true
		} else {
			isLarge.value = false
		}
	}
	isLargeMQ.addEventListener("change", handleChange)

	onBeforeUnmount(() => {
		isLargeMQ.removeEventListener("change", handleChange)
	})

	return {
		isLarge,
	}
}