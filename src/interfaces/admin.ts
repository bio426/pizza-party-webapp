import { Timestamp, GeoPoint } from "firebase/firestore"

import { ICartItem } from "./cart"

export interface IOrderResponse {
	id: string
	clientAddress: string
	clientPhone: number
	clientCords: GeoPoint
	createdAt: Timestamp
	items: ICartItem[]
}
