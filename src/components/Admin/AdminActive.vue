<template>
	<div class="Active">
		<span class="Active__title"> Datos del pedido </span>
		<div class="Active__noOrder" v-if="order.id == ''">
			<img class="Active__ico" src="../../assets/icons/empty.svg" />
			No hay pedido seleccionado
		</div>
		<div v-else>
			<span class="Active__label">Id</span>
			<span class="Active__info">{{ order.id }}</span>
			<span class="Active__label">Direccion</span>
			<span class="Active__info">{{ order.clientAddress }}</span>
			<span class="Active__label">Telefono</span>
			<span class="Active__info">{{ order.clientPhone }}</span>
			<span class="Active__label">Hora del pedido</span>
			<span class="Active__info">{{ formatedTime }}</span>
			<span class="Active__label">Costo del pedido</span>
			<span class="Active__info">S/ {{ orderPrice.toFixed(2) }}</span>
			<span class="Active__label">Tipo de pago</span>
			<span class="Active__info">{{ order.payment.type }}</span>
			<span class="Active__label" v-if="order.payment.type == 'contado'"
				>Paga con</span
			>
			<span class="Active__info">{{ order.payment.payWith }}</span>
		</div>
		<div class="Active__fixed">
			<button class="Active__button" @click="copyFormated">GenString</button>
			<button class="Active__button">HideOrder</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue"

import useNotyf from "../../composables/useNotyf"
import { IOrderResponse } from "../../interfaces"

const props = defineProps({
	order: {
		type: Object as PropType<IOrderResponse>,
		required: true,
	},
})
const { notyf } = useNotyf()

let formatedTime = computed(() => {
	let time = props.order.createdAt.toDate()
	let hours: string | number = time.getHours()
	let minutes: string | number = time.getMinutes()
	if (hours < 10) {
		hours = "0" + hours.toString()
	}
	if (minutes < 10) {
		minutes = "0" + minutes.toString()
	}
	return `${hours}:${minutes}`
})
let orderPrice = computed(() => {
	let price: number = 0
	props.order.items.forEach((item) => {
		price += item.price * item.quantity
	})
	return price
})

function copyFormated() {
	let formated = `Hora: ${formatedTime.value}\nNombre: ${"Juan"}\nCel: ${
		props.order.clientPhone
	}\nPedido: ${5}\nPago: ${6}\nDelivery: ${7}\nDirección: ${8}\nMapsLink ${9}`
	navigator.clipboard.writeText(formated)
	notyf.success("Orden copiado")
}
</script>

<style lang="scss">
.Active {
	position: relative;
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);

	&__title {
		display: block;
		margin-bottom: 1rem;
		text-align: center;
		font-size: 1.4rem;
		font-weight: 600;
	}

	&__noOrder {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		height: 15rem;
	}

	&__label {
		display: block;
		font-size: 0.9rem;
		text-decoration: underline;
	}

	&__info {
		display: block;
		margin: 0.2rem 0;
		font-size: 1rem;
	}

	&__fixed {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		left: 1rem;
		display: flex;
		justify-content: space-around;
	}

	&__button {
		padding: 0.5rem;
		font-size: 1rem;
		outline: none;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
