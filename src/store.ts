import { createStore, Store, useStore as baseUseStore } from "vuex"
import { InjectionKey } from "vue"

import { ICartItem } from "./interfaces"

interface State {
	cart: ICartItem[]
	address: {
		cords: {
			lat: number
			lng: number
		}
		name: string
		deliveryTime: number
		distance: number
	}
}

export default createStore<State>({
	state: {
		cart: [],
		address: {
			cords: { lat: 0, lng: 0 },
			name: "",
			deliveryTime: 0,
			distance: 0,
		},
	},
	getters: {
		cartPrice(state) {
			let price = 0
			state.cart.forEach((item) => {
				price += item.price * item.quantity
			})
			return price
		},
		deliveryTimeInMin(state) {
			return Math.round(state.address.deliveryTime / 60)
		},
		deliveryPrice(state) {
			let kilometers = Math.round(state.address.distance / 1000)
			let costPerKilometer = kilometers < 3 ? 2 : 1.5
			return kilometers * costPerKilometer
		},
		pizzaCount(state) {
			let count = 0
			state.cart.map((product) => {
				if (product.tag == "classic" || product.tag == "premium") {
					count++
				}
				if (product.tag == "combo" && product.contains) {
					count += product.contains.pizza?.length || 0
				}
			})
			return count
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
				deliveryTime: payload.travelTime,
			}
		},
	},
	actions: {},
	plugins: [],
})

export const key: InjectionKey<Store<State>> = Symbol()

// export function useStore() {
// 	return baseUseStore(key)
// }
