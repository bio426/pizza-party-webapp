import { createStore, Store, useStore as baseUseStore } from "vuex"
import { InjectionKey } from "vue"

import { ICartItem } from "./interfaces/cart"

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
}

export default createStore<State>({
	state: {
		cart: [],
		address: null,
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
			let newItem = payload.product as ICartItem
			if (newItem.tag == "combo" || state.cart.length == 0) {
				state.cart.push(newItem)
			} else {
				for (let i = 0; i < state.cart.length; i++) {
					let sameCode = state.cart[i].code == newItem.code
					let bothHaveCheese =
						typeof state.cart[i].contains == typeof newItem.contains

					if (sameCode && bothHaveCheese) {
						state.cart[i].quantity += 1
						return
					}
				}
				state.cart.push(newItem)
			}
		},
		removeFromCart(state, payload) {
			state.cart.splice(payload.index, 1)
		},
		clearCart(state, payload) {
			state.cart = []
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
	},
	actions: {},
	plugins: [],
})

export const key: InjectionKey<Store<State>> = Symbol()

export function useStore() {
	return baseUseStore(key)
}
