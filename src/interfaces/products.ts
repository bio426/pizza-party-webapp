export interface IProduct {
  id: string
  name: string
  code: string
  price: number
  tag: string
  includes?: ProductIncludes
}

export interface ProductIncludes {
  pizza?: number
  drink?: number
  bread?: number
}
