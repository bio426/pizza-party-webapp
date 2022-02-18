<template>
	<teleport to="#modals">
		<div
			class="fixed top-0 flex justify-center items-center w-full h-screen bg-modal z-20"
		>
			<div class="w-9/10 md:w-7/10 lg:w-1/2 max-h-[90vh] p-4 bg-white">
				<div
					class="flex justify-between items-center mb-2 pb-2 border-b border-black"
				>
					<span class="text-2xl">{{ title }}</span>
					<button @click="$emit('closeModal')">
						<img
							class="block w-6"
							src="../../assets/icons/close.svg"
							alt="close icon"
						/>
					</button>
				</div>
				<slot />
			</div>
		</div>
	</teleport>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: "Modal Title",
	},
})

defineEmits(["closeModal"])
</script>

<style>
</style>
