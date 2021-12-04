import { ref } from "vue"
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	QuerySnapshot,
} from "firebase/firestore"

import { IProduct } from "../interfaces/products"

export default function (tag: string) {
	const db = getFirestore()

	let documents = ref<IProduct[]>([])
	let ready = ref(false)

	let q = query(collection(db, "products"), where("tag", "==", tag))

	async function getProducts() {
		let snap = (await getDocs(q)) as QuerySnapshot<IProduct>
		snap.forEach((doc) => {
			documents.value.push({
				...doc.data(),
				id: doc.id
			})
			ready.value = true
		})
	}
	getProducts()

	return {
		ready,
		documents,
	}
}
