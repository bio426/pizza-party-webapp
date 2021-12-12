<template>
	<div class="Items">
		<div class="Items__title">Productos de la pedido</div>
		<div class="Items__noItems" v-if="items.length == 0">
			<img class="Items__ico" src="../assets/icons/empty.svg" />
			No hay pedido seleccionado
		</div>
		<div class="Items__container">
			<div class="Items__item" v-for="(item, i) in items" :key="i">
				x{{ item.quantity }} {{ item.name }}
				<ul class="Items__nested" v-if="item.contains">
					<li v-if="item.contains.cheese">Con extra queso</li>
					<li v-for="pizza in item.contains.pizza">
						{{ pizza }}
					</li>
					<li v-for="drink in item.contains.drink">
						{{ drink }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue"

import { ICartItem } from "../interfaces/cart"

export default defineComponent({
	name: "AdminItems",
	props: {
		items: {
			type: Array as PropType<ICartItem[]>,
			required: true,
		},
	},
	setup() {
		return {}
	},
})
</script>

<style lang="scss">
.Items {
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

	&__noItems {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		height: 15rem;
	}

	&__container{
		max-height: 17rem;
		overflow-y: auto;
	}

	&__item {
		margin: 0.5rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #000;
	}

	&__nested {
		display: block;
		margin-left: 1rem;
		padding-left: 1rem;
		border-left: 1px solid #000;
		list-style: none;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
