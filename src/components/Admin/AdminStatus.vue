<template>
	<div>
		<h4 class="block mb-2 text-xl font-medium">Estado de cocina</h4>
		<div class="flex justify-center items-center gap-4">
			<label class="block">
				Recibiendo pedidos
				<select
					class="block w-full mt-2 p-2 disabled:bg-gray-200 disabled:text-gray-500 text-lg border border-black"
					v-model="kitchenActive"
					:disabled="!updating"
				>
					<option :value="true">Activado</option>
					<option :value="false">desactivado</option>
				</select>
			</label>
			<label class="block">
				Tiempo de preparación (Min)
				<input
					class="block mt-2 p-2 disabled:bg-gray-200 disabled:text-gray-500 border border-black"
					type="number"
					v-model="kitchenWaitTime"
					:disabled="!updating"
				/>
			</label>
			<label class="block">
				Precio de delivery (Km)
				<input
					class="block mt-2 p-2 disabled:bg-gray-200 disabled:text-gray-500 border border-black"
					type="number"
					v-model="deliveryPrice"
					:disabled="!updating"
				/>
			</label>
			<label class="block">
				Precio de extra queso (S/.)
				<input
					class="block mt-2 p-2 disabled:bg-gray-200 disabled:text-gray-500 border border-black"
					type="number"
					v-model="extracheesePrice"
					:disabled="!updating"
				/>
			</label>
			<div>
				<button
					class="block p-2 disabled:bg-gray-200 disabled:text-gray-500 border border-black"
					@click="handleUpdate"
					:disabled="buttonDisabled"
				>
					{{ updating ? "Guardar" : "Modificar" }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import useNotyf from "../../composables/useNotyf"
import FirestoreService from "../../services/FirestoreService"

const { notyf } = useNotyf()

let kitchenActive = ref(false)
let kitchenWaitTime = ref(0)
let deliveryPrice = ref(0)
let extracheesePrice = ref(0)
let updating = ref(false)
let buttonDisabled = ref(false)

FirestoreService.getKitchenStatus().then((status) => {
	kitchenActive.value = status.kitchenActive
	kitchenWaitTime.value = status.kitchenWaitTime
	deliveryPrice.value = status.deliveryPrice
	extracheesePrice.value = status.extraCheesePrice
})

function handleUpdate() {
	if (!updating.value) {
		updating.value = true
	} else {
		updating.value = false
		buttonDisabled.value = true
		FirestoreService.updateKitchenStatus({
			kitchenActive: kitchenActive.value,
			kitchenWaitTime: kitchenWaitTime.value,
			deliveryPrice: deliveryPrice.value,
			extraCheesePrice: extracheesePrice.value,
		}).then(() => {
			buttonDisabled.value = false
			notyf.success("Estado de cocina actualizado")
		})
	}
}
</script>

<style></style>
