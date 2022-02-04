import { Timestamp, GeoPoint } from "firebase/firestore"

export interface IProduct {
	id: string
	name: string
	code: string
	description: string
	price: number
	tag: string
	image: string
	includes?: ProductIncludes
}

export interface ProductIncludes {
	pizza?: number
	drink?: number
	bread?: number
}

export interface IComboItem {
	id: string
	name: string
	image: string
	selected: boolean
}

export interface ICartItem {
	id: string
	image: string
	name: string
	code: string
	price: number
	quantity: number
	tag: string
	contains?: ItemContains
}

interface ItemContains {
	cheese?: boolean
	pizza?: string[]
	drink?: string[]
}

export interface IOrder {
	clientAddress: string
	clientCords: {
		lat: number
		lng: number
	}
	clientPhone: string
	payment: {
		type: string
		payWith?: number
	}
	items: ICartItem[]
}

export interface IOrderResponse {
	id: string
	clientAddress: string
	clientPhone: number
	clientCords: GeoPoint
	createdAt: Timestamp
	payment: {
		type: string
		payWith?: number
	}
	items: ICartItem[]
}

export interface IAdminStatus {
	kitchenLoad: number
}
