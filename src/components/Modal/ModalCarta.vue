<template>
	<ModalBase title="Nuestra carta" @close-modal="$emit('closeCarta')">
		<img
			class="block w-1/2 mx-auto mb-4"
			src="https://res.cloudinary.com/pizza-party/image/upload/v1647637341/pizza-products-v2/carta_wahv0b.webp"
			alt="carta de comidas"
		/>
		<a
			class="block w-full p-2 bg-green-500 text-white rounded-lg text-center font-bold"
			href="https://res.cloudinary.com/pizza-party/image/upload/v1647637341/pizza-products-v2/carta_wahv0b.webp"
			download
			>Descargar</a
		>
	</ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./ModalBase.vue"

const emits = defineEmits(["closeCarta"])
</script>
