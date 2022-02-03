import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app"
import {
	addDoc,
	collection,
	GeoPoint,
	getDoc,
	getDocs,
	doc,
	getFirestore,
	QuerySnapshot,
	Timestamp,
	Firestore,
} from "firebase/firestore"

import { IProduct, IOrder } from "../interfaces"

class FirestoreService {
	private appConfig: FirebaseOptions = {
		apiKey: "AIzaSyDxgoTxRbW1eeqSg4_j8uuclTyHVZl0xRs",
		authDomain: "pag-web-pp.firebaseapp.com",
		projectId: "pag-web-pp",
		storageBucket: "pag-web-pp.appspot.com",
		messagingSenderId: "874695662257",
		appId: "1:874695662257:web:1919ac92d4061d129d2090",
	}
	private app: FirebaseApp
	private db: Firestore

	constructor() {
		this.app = initializeApp(this.appConfig)
		this.db = getFirestore()
	}

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

	async getKitchenInfo() {
		let snap = await getDoc(doc(this.db, "admin", "status"))
		let raw = { ...snap.data() } as { kitchenLoad: number }
		return raw
	}

	async sendOrder(order: IOrder) {
		let res = await addDoc(collection(this.db, "orders"), {
			clientAddress: order.clientAddress,
			clientPhone: order.clientPhone,
			clientCords: new GeoPoint(order.clientCords.lat, order.clientCords.lng),
			createdAt: Timestamp.now(),
			items: order.items,
		})
		return res
	}
}

export default new FirestoreService()
