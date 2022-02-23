<template>
	<ModalBase title="Fuera de horario" @close-modal="$emit('closeUnavailable')" >
		<div>
			<h4>Pedido en linea no disponible</h4>
			<p>El horario de atencion es de 00:00 a 00:00. Intente mas tarde.</p>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import {} from "vue"

const emits = defineEmits(["closeUnavailable"])

import ModalBase from "./ModalBase.vue"
</script>
