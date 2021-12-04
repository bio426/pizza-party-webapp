export interface ICartItem {
	id: string
	name: string
	code: string
	price: number
	quantity: number
	contains?: ItemContains
}

interface ItemContains {
	cheese?: boolean
	pizza?: string[]
  drink?: string[]
  bread?: number
}
