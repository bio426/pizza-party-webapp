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
	code: string
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
	pizza?: { name: string; code: string }[]
	drink?: { name: string; code: string }[]
}

export interface IOrder {
	id?: string
	user: {
		name: string
		phone: string
		id?: string
	}
	address: {
		name: string
		lat: number
		lng: number
	}
	price: {
		items: number
		delivery: number
	}
	createdAt: Date
	completed: boolean
	items: ICartItem[]
}

export interface IAdminStatus {
	deliveryPrice: number
	kitchenActive: boolean
	kitchenWaitTime: number
	extraCheesePrice: number
}
