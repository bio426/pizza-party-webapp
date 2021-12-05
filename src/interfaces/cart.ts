export interface ICartItem {
	id: string
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
