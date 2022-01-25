<template>
	<div class="Status">
		<div class="Status__block">
			<h2 class="Status__subtitle">
				Carga de cocina actual: {{ formatedCharge }}
			</h2>
			<h4>Cambiar carga</h4>
			<label>
				<input type="radio" name="charge" value="1" v-model="localCharge" />
				Baja
			</label>
			<label>
				<input type="radio" name="charge" value="2" v-model="localCharge" />
				Media
			</label>
			<label>
				<input type="radio" name="charge" value="3" v-model="localCharge" />
				Alta
			</label>
			<button @click="updateKitchenCharge">Actualizar</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue"
import { getFirestore, onSnapshot, doc, updateDoc } from "firebase/firestore"

const db = getFirestore()

// getting kitchenCharge
const unsubscribe = onSnapshot(doc(db, "admin", "status"), (doc) => {
	let rawData = { ...doc.data() } as { kitchenCharge: number }
	realCharge.value = rawData.kitchenCharge
})
onBeforeUnmount(() => unsubscribe())

// update kitchenCharge
const updateKitchenCharge = () => {
	realCharge.value = -1
	updateDoc(doc(db, "admin", "status"), {
		kitchenCharge: localCharge.value,
	})
}

let realCharge = ref(-1)
let localCharge = ref(1)

let formatedCharge = computed<string>(() => {
	if (realCharge.value == 1) {
		return "Baja"
	} else if (realCharge.value == 2) {
		return "Media"
	} else if (realCharge.value == 3) {
		return "Alta"
	} else {
		return "Cargando..."
	}
})
</script>

<style lang="scss">
@import "../assets/styles/variables";

.Status {
	display: block;
	width: 100%;
	margin-bottom: 1rem;
	padding: 1rem;
	background: #fff;
	border-radius: 0.5rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);

	&__block {
	}

	&__subtitle {
		margin-bottom: 1rem;
	}
}
</style>
