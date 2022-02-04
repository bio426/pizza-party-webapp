<template>
	<button
		class="Alarm"
		:class="[alerting ? 'Alarm--animated' : '']"
		@click="$emit('attended')"
	>
		{{ alerting ? "Hay pedidos nuevos" : "Sin nuevos pedidos" }}
	</button>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"

export default defineComponent({
	name: "AdminAlarm",
	props: {
		alerting: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, ctx) {
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

		return {
			isActive,
		}
	},
})
</script>

<style lang="scss">

.Alarm {
	display: block;
	width: 100%;
	margin-bottom: 1rem;
	padding: 1rem;
	background: #fff;
	color: $red;
	border: 2px solid $red;
	border-radius: 0.5rem;
	cursor: pointer;
	font-size: 1.2rem;
	font-weight: 600;

	&--animated {
		animation: changeColor 2s infinite;
		box-shadow: 0 0 10px rgba($color: $red, $alpha: 0.3);
	}
}

@keyframes changeColor {
	0%,
	100% {
		background: #fff;
		color: $red;
	}
	50% {
		background: $red;
		color: #fff;
	}
}
</style>
