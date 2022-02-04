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

import { IProduct, IOrder, IAdminStatus } from "../interfaces"

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
			clientAddress: order.clientAddress,
			clientPhone: order.clientPhone,
			clientCords: new GeoPoint(order.clientCords.lat, order.clientCords.lng),
			createdAt: Timestamp.now(),
			payment: order.payment,
			items: order.items,
		})
		return res
	}

	async getKitchenInfo() {
		let snap = await getDoc(doc(this.db, "admin", "status"))
		let raw = { ...snap.data() } as IAdminStatus
		return raw
	}

	async updateKitchenLoad(load: number) {
		let resolved = await updateDoc(doc(this.db, "admin", "status"), {
			kitchenLoad: load,
		})
		return resolved
	}

	subscribeKitchenLoad(onSnap: (doc: DocumentSnapshot) => void) {
		let unsubscribe = onSnapshot(doc(this.db, "admin", "status"), onSnap)
		return unsubscribe
	}

	subscribeOrders(onSnap: (doc: QuerySnapshot) => void) {
		let todayInit = new Date()
		todayInit.setHours(0, 0, 0, 0)
		let q = query(
			collection(this.db, "orders"),
			where("createdAt", ">=", Timestamp.fromDate(todayInit)),
			orderBy("createdAt", "desc")
		)
		let unsubscribe = onSnapshot(q, onSnap)
		return unsubscribe
	}
}

export default new FirestoreService()
