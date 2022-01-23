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
