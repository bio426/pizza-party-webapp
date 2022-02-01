import {
	collection,
	getDocs,
	getFirestore,
	QuerySnapshot,
} from "firebase/firestore"

import { IProduct } from "../interfaces"

class ProductsService {
	db = getFirestore()

	async getProducts(): Promise<IProduct[]> {
		let products: any[] = []
		let snap = (await getDocs(
			collection(this.db, "products")
		)) as QuerySnapshot<IProduct>
		snap.forEach((doc) => {
			products.push({
				...doc.data(),
				id: doc.id,
			})
		})
		return products
	}
}

export default new ProductsService()
