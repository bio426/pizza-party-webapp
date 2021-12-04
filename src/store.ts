import { createStore, Store } from "vuex"
import { InjectionKey } from "vue"

import { ICartItem } from "./interfaces/cart"
import { IProduct } from "./interfaces/products"

interface State {
	cart: ICartItem[]
	address: null | {
		cords: {
			lat: number
			lng: number
		}
		distance: number
		name: string
		travelTime: number
	}
	comboSelectables: IProduct[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export default createStore<State>({
	state: {
		cart: [],
		address: null,
		comboSelectables: [],
	},
	getters: {
		cartPrice(state) {
			let price = 0
			state.cart.forEach((item) => {
				price += item.price * item.quantity
			})
			return price
		},
	},
	mutations: {
		addToCart(state, payload) {
			state.cart.push(payload.product)
		},
		removeFromCart(state, payload) {
			state.cart.splice(payload.index, 1)
		},
		changeItemQuantity(state, payload) {
			if (payload.operation == "+") {
				state.cart[payload.index].quantity++
			} else if (state.cart[payload.index].quantity != 1) {
				state.cart[payload.index].quantity--
			}
		},
		setUserAddress(state, payload) {
			state.address = {
				name: payload.name,
				cords: payload.cords,
				distance: payload.distance,
				travelTime: payload.travelTime,
			}
		},
		addComboSelectable(state, payload) {
			state.comboSelectables.push(payload.product)
		},
	},
	actions: {},
	plugins: [],
})
