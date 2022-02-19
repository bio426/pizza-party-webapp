<template>
	<button
		class="block w-full mb-4 p-4 bg-white text-red-500 border-2 border-red-500 rounded-lg text-xl font-bold"
		:class="{ 'alert-animate': alerting }"
		@click="$emit('attended')"
	>
		{{ alerting ? "Hay pedidos nuevos" : "Sin nuevos pedidos" }}
	</button>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps({
	alerting: {
		type: Boolean,
		default: false,
	},
})
const emits = defineEmits(["attended"])

let isActive = ref(false)
let sound = new Audio(
	new URL("../../assets/multimedia/sound.mp3", import.meta.url).href
)
sound.loop = true
sound.volume = 0.5

watch(
	() => props.alerting,
	(actual, previous) => {
		if (props.alerting) {
			sound.play()
		} else {
			sound.pause()
			sound.currentTime = 0
		}
	}
)
</script>

<style>
.alert-animate {
	animation: changeColor 2s infinite;
	box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

@keyframes changeColor {
	0%,
	100% {
		background: #fff;
		color: rgb(239, 68, 68);
	}
	50% {
		background: rgb(239, 68, 68);
		color: #fff;
	}
}
</style>
