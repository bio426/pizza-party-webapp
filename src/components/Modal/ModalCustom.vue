<template>
	<ModalBase title="Arma tu pizza" @close-modal="$emit('closeCustom')">
		<div>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni natus
				eligendi reprehenderit ipsam possimus facilis labore magnam quasi. Sint
				corrupti molestiae cumque nulla iure reiciendis quod temporibus et at
				laboriosam?
			</p>
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./ModalBase.vue"

const emits = defineEmits(["closeCustom"])
</script>

<style></style>
