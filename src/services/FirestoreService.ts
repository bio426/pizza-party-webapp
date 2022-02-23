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
	onSnapshot,
	DocumentSnapshot,
	updateDoc,
	query,
	where,
	orderBy,
} from "firebase/firestore"

import { IProduct, IAdminStatus, IOrder, ICartItem } from "../interfaces"

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

	async sendOrder(order: IOrder) {
		let res = await addDoc(collection(this.db, "orders"), {
			user: {
				...order.user,
			},
			address: {
				name: order.address.name,
				cords: new GeoPoint(order.address.lat, order.address.lng),
			},
			price: {
				...order.price,
			},
			createdAt: Timestamp.fromDate(order.createdAt),
			completed: order.completed,
			items: order.items,
		})
		return res
	}

	async getKitchenStatus() {
		let snap = await getDoc(doc(this.db, "admin", "status"))
		let raw = { ...snap.data() } as IAdminStatus
		return raw
	}

	async updateKitchenStatus(status: Partial<IAdminStatus>) {
		let resolved = await updateDoc(doc(this.db, "admin", "status"), status)
		return resolved
	}

	subscribeOrders(onSnap: (orders: IOrder[]) => void) {
		let todayInit = new Date()
		todayInit.setHours(0, 0, 0, 0)
		let q = query(
			collection(this.db, "orders"),
			where("createdAt", ">=", Timestamp.fromDate(todayInit)),
			orderBy("createdAt", "desc")
		)
		// let unsubscribe = onSnapshot(q, onSnap)
		let unsubscribe = onSnapshot(q, (snap) => {
			let orders: IOrder[] = []
			snap.forEach((doc) => {
				let raw = { ...doc.data() }
				let cords = raw.address.cords as GeoPoint
				let createdAt = raw.createdAt as Timestamp
				let processed: IOrder = {
					id: doc.id,
					user: { ...raw.user },
					address: {
						name: raw.address.name,
						lat: cords.latitude,
						lng: cords.longitude,
					},
					price: { ...raw.price },
					completed: raw.completed,
					createdAt: createdAt.toDate(),
					items: raw.items,
				}
				orders.push(processed)
			})
			onSnap(orders)
		})
		return unsubscribe
	}
}

export default new FirestoreService()
